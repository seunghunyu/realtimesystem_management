package com.realtime.management.service.component.strategy;

import com.realtime.management.dto.camp.ComponentRequest;
import com.realtime.management.dto.camp.ComponentResponse;
import com.realtime.management.dto.camp.SchedulerData;
import com.realtime.management.entity.*;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.CampRepository;
import com.realtime.management.repository.CampSchInfoRepository;
import com.realtime.management.repository.CampSchTimeRepository;
import com.realtime.management.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component //Bean으로 등록해야 서비스 구현체에서 ComponentStrategy 정보를 전부 긁어 올 수 있음
@RequiredArgsConstructor
public class SchedulerStrategy implements ComponentStrategy{
    private final CampRepository campRepository;
    private final ComponentRepository componentRepository;
    private final CampSchInfoRepository campSchInfoRepository;
    private final CampSchTimeRepository campSchTimeRepository;

    @Override
    public String getObjKind() {
        return "scheduler";
    }

    @Override
    public ComponentResponse save(ComponentRequest request) {
        SchedulerData data = request.getSchedulerData();
        if(data == null){
            throw new IllegalArgumentException("스케줄러 저장에 필요한 상세 데이터(schedulerData)가 없습니다.");
        }
        Camp camp = campRepository.findById(request.getCampId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CMP_NOT_FOUND));

        Cmpnt cmpnt = Cmpnt.builder()
                .cmpntId(request.getCmpntId())
                .cmpntNm(request.getCmpntNm())
                .cmpntDesc(request.getCmpntDesc())
                .camp(camp)
                .fromCmpntId(request.getFromCmpntId())
                .build();

        componentRepository.save(cmpnt);

        CampSchInfo schInfo = CampSchInfo.builder()
                .id(new CampSchInfoId(request.getCmpntId(), request.getCampId()))
                .schNm(data.getSchNm())
                .objKind(data.getObjKind())
                .schDesc(data.getSchDesc())
                .strDt(data.getStrDt())
                .endDt(data.getEndDt())
                .strTm(data.getStrTm())
                .endTm(data.getEndTm())
                .build();

        campSchInfoRepository.save(schInfo);

        if ("batch".equalsIgnoreCase(data.getObjKind()) && data.getTimes() != null && !data.getTimes().isEmpty()) {
            List<CampSchTime> timeList = data.getTimes().stream()
                    .map(time -> CampSchTime.builder()
                            .id(new CampSchTimeId(request.getCmpntId(), time))
                            .build())
                    .toList();

            campSchTimeRepository.saveAll(timeList);
        }
        return ComponentResponse.from(cmpnt);
    }

    @Override
    public ComponentResponse update(ComponentRequest request) {
        SchedulerData data = request.getSchedulerData();

        Cmpnt cmpnt = componentRepository.findById(request.getCmpntId())
                .orElseThrow(()->new BusinessException(ErrorCode.CMPNT_NOT_FOUND));
        if (data == null) return ComponentResponse.from(cmpnt);

        CampSchInfoId schInfoId = new CampSchInfoId(request.getCmpntId(), request.getCampId());
        CampSchInfo schInfo = campSchInfoRepository
                .findById(schInfoId).orElseThrow(() -> new BusinessException(ErrorCode.SCH_NOT_FOUND));
        schInfo.update(request.getSchedulerData());
        if ("batch".equalsIgnoreCase(data.getObjKind())) {
            // ① 해당 sch_id의 기존 시간 목록 전체 삭제

            campSchTimeRepository.deleteByIdSchId(request.getCmpntId());

            // ② 새로 들어온 시간 목록 Insert
            if (data.getTimes() != null && !data.getTimes().isEmpty()) {
                List<CampSchTime> timeList = data.getTimes().stream()
                        .map(time -> CampSchTime.builder()
                                .id(new CampSchTimeId(request.getCmpntId(), time))
                                .build())
                        .toList();

                campSchTimeRepository.saveAll(timeList);
            }
        }

        return ComponentResponse.from(cmpnt);
    }

    @Override
    public void delete(ComponentRequest request) {
        CampSchInfoId id = new CampSchInfoId(request.getCmpntId(), request.getCampId());
        campSchInfoRepository.deleteById(id);
        SchedulerData data = request.getSchedulerData();
        if ("batch".equalsIgnoreCase(data.getObjKind())) {
            // ① 해당 sch_id의 기존 시간 목록 전체 삭제
            campSchTimeRepository.deleteByIdSchId(request.getCmpntId());
        }
    }

    @Override
    public ComponentResponse findById(ComponentRequest request) {

        Cmpnt cmpnt = componentRepository.findById(request.getCmpntId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CMPNT_NOT_FOUND));
        CampSchInfoId id = new CampSchInfoId(request.getCmpntId(), request.getCampId());
        CampSchInfo schInfo = campSchInfoRepository.findById(id).orElseThrow(()->new BusinessException(ErrorCode.CMP_NOT_FOUND));
        List<String> times = null;
        if("batch".equalsIgnoreCase(request.getCmpntType())) {
            List<CampSchTime> timeList = campSchTimeRepository.findAllByIdSchId(request.getCmpntId());
            times = timeList.stream()
                    .map(t -> t.getId().getSchTime())
                    .toList();
        }
        SchedulerData schedulerData = SchedulerData.builder()
                .schNm(schInfo.getSchNm())
                .objKind(schInfo.getObjKind())
                .strDt(schInfo.getStrDt())
                .endDt(schInfo.getEndDt())
                .strTm(schInfo.getStrTm())
                .endTm(schInfo.getEndTm())
                .times(times) // ["09:00", "13:00"]
                .build();

        return ComponentResponse.from(cmpnt, schedulerData);


    }


}
