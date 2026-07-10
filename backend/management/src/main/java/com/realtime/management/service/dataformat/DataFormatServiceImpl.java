package com.realtime.management.service.dataformat;

import com.realtime.management.dto.dataformat.DataFormatRequest;
import com.realtime.management.dto.dataformat.DataFormatResponse;
import com.realtime.management.dto.item.ItemResponse;
import com.realtime.management.entity.*;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.DataFormatItemRepository;
import com.realtime.management.repository.DataFormatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DataFormatServiceImpl implements DataFormatService{

    private final DataFormatRepository dataFormatRepository;

    private final DataFormatItemRepository dataFormatItemRepository;

    @Override
    public DataFormatResponse save(DataFormatRequest request) {
        if(dataFormatRepository.existsById(request.getFormatId())){
            throw new BusinessException(ErrorCode.DEPT_ALREADY_EXISTS);
        }
        String finalFormatId = request.getFormatId();
        if (finalFormatId == null || finalFormatId.isBlank()) {
            finalFormatId = generateNextItemId();
        }

        DataFormatInfo dataFormatInfo = DataFormatInfo.builder()
                .formatId(finalFormatId)
                .formatNm(request.getFormatNm())
                .formatDesc(request.getFormatDesc())
                .createdAt(LocalDateTime.now())
                .build();


        if(request.getFieldInfos() != null && !request.getFieldInfos().isEmpty()){
            String formatId = finalFormatId;
            List<DataFormatItem> mapEntities = request.getFieldInfos().stream()
                    .map(info -> {
                        DataFormatId mapId = DataFormatId.builder()
                                .formatId(formatId)
                                .fieldNm(info.getFieldNm())
                                .build();


                        return DataFormatItem.builder()
                                .id(mapId)
                                .dataFormatInfo(dataFormatInfo)
                                .build();
                    }).toList();
            dataFormatInfo.getItems().addAll(mapEntities);
            dataFormatRepository.save(dataFormatInfo);
        }
        return DataFormatResponse.from(dataFormatInfo);
    }

    @Override
    public DataFormatResponse update(String formatId, DataFormatRequest request) {
        DataFormatInfo formatInfo = dataFormatRepository.findById(request.getFormatId())
                .orElseThrow(() -> new BusinessException(ErrorCode.DF_NOT_FOUND));

        DataFormatItem formatItemInfo = dataFormatItemRepository.findById(request.getFormatId())
                .orElseThrow(()-> new BusinessException(ErrorCode.DF_NOT_FOUND));
        List<DataFormatItem> eItems = null;
        if (request.getFieldInfos() != null) {
            eItems = request.getFieldInfos().stream()
                    .map(info -> {
                        // 복합키(ID) 생성
                        DataFormatId mapId = DataFormatId.builder()
                                .formatId(formatId)
                                .fieldNm(info.getFieldNm())
                                .build();

                        // 자식 엔티티 빌드
                        return DataFormatItem.builder()
                                .id(mapId)
                                .fieldVal(info.getFieldVal())
                                .fieldType(info.getFieldType())
                                .dataFormatInfo(formatInfo) // 연관관계 편의 매핑
                                .build();
                    }).toList();
        }


        formatInfo.update(request.getFormatNm(), request.getFormatDesc(), eItems);

        return DataFormatResponse.from(formatInfo);
    }

    @Override
    public void delete(String formatId) {
        DataFormatInfo formatInfo = dataFormatRepository.findById(formatId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DF_NOT_FOUND));

        dataFormatRepository.delete(formatInfo);
    }

    @Override
    public DataFormatResponse findById(String formatId) {
        DataFormatInfo formatInfo = dataFormatRepository.findById(formatId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DF_NOT_FOUND));
        return DataFormatResponse.from(formatInfo);
    }

    @Override
    public List<DataFormatInfo> findAll() {
        return dataFormatRepository.findAll();
    }

    private String generateNextItemId() {
        String maxId = dataFormatRepository.findMaxItemId(); // 예: "I0000005"

        if (maxId == null || maxId.isBlank()) {
            // DB에 데이터가 하나도 없다면 최초의 ID 리턴
            return "DF0000001";
        }

        try {
            // "I0000005" 에서 알파벳 "I"를 잘라내고 숫자 "0000005" 문자열만 추출
            String numericPart = maxId.substring(1);
            // 숫자로 변환 (5) 한 뒤 1을 더함 (6)
            int nextNumber = Integer.parseInt(numericPart) + 1;

            // 다시 자릿수(7자리 영문 채움)를 맞춰서 포맷팅 -> "I0000006"
            return String.format("DF%07d", nextNumber);
        } catch (Exception e) {
            // 혹시나 포맷이 깨진 기존 데이터가 있을 때를 대비한 방어 코드
            return "DF0000001";
        }
    }
}
