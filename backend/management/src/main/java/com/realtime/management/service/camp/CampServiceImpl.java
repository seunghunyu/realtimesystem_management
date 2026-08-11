package com.realtime.management.service.camp;

import com.realtime.management.dto.camp.*;
import com.realtime.management.dto.dept.DeptsResponse;
import com.realtime.management.dto.item.ItemResponse;
import com.realtime.management.entity.*;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.CampBrchRepository;
import com.realtime.management.repository.CampDesignRepository;
import com.realtime.management.repository.CampRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CampServiceImpl implements CampService{
    private final CampRepository campRepository;
    private final CampBrchRepository campBrchRepository;
    private final CampDesignRepository campDesignRepository;

    @Override
    public CampResponse save(CampRequest request) {
        if(campRepository.existsById(request.getCampId())){
            throw new BusinessException(ErrorCode.CMP_ALREADY_EXISTS);
        }

        // 💡 1. 아이템 ID가 없거나 공백일 때 자동 생성 로직 작동
        String finalCampId = request.getCampId();
        if (finalCampId == null || finalCampId.isBlank()) {
            finalCampId = generateNextItemId();
        }
        Camp camp = Camp.builder()
                .campId(finalCampId)
                .campNm(request.getCampNm())
                .campDesc(request.getCampDesc())
                .campBrch1(request.getCampBrch1())
                .campBrch2(request.getCampBrch2())
                .build();

        campRepository.save(camp);

        return CampResponse.from(camp);
    }

    @Override
    public CampResponse update(CampRequest request) {
        Camp camp = campRepository.findById(request.getCampId())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND)); // (부서 없을 때 예외처리 추가)

        camp.update(request);

        return CampResponse.from(camp);
    }

    @Override
    public void delete(String campId) {
        Camp camp = campRepository.findById(campId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CMP_NOT_FOUND));

        campRepository.delete(camp);
    }

    @Override
    public CampResponse findById(String campId) {
        Camp camp = campRepository.findById(campId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CMP_NOT_FOUND));
        return CampResponse.from(camp);
    }

    @Override
    public List<Camp> findAll() {
        return campRepository.findAll();
    }

    @Override
    public List<CampBrch> campBrchFindAll() {
        return campBrchRepository.findAll();
    }

    @Override
    public List<HierarchyBrchResponse> getBrchTree() {
        return campBrchRepository.findAllWithSubBranches().stream()
                .map(HierarchyBrchResponse::from)
                .toList();
    }

    @Override
    public CampDesignDto getCampDesign(String campId) {
        return campDesignRepository.findById(campId)
                .map(CampDesign::getDesignData)
                // 저장된 디자인 정보가 없으면 빈 nodes, edges 반환
                .orElseGet(() -> new CampDesignDto(Collections.emptyList(), Collections.emptyList()));
    }

    @Override
    public void saveCampDesign(String campId, CampDesignDto designDto) {
        // 이미 존재하면 수정(JPA 더티 체킹/save), 없으면 신규 저장
        CampDesign campDesign = campDesignRepository.findById(campId)
                .map(design -> {
                    design.setDesignData(designDto);
                    return design;
                })
                .orElseGet(() -> new CampDesign(campId, designDto));

        campDesignRepository.save(campDesign);
    }

    @Override
    public void updateCampDesign(String campId, CampDesignDto designDto) {
        CampDesign campDesign = campDesignRepository.findById(campId)
                .orElseThrow(() -> new IllegalArgumentException("해당 캠페인 디자인 정보를 찾을 수 없습니다. id=" + campId));

        // 객체의 필드만 변경하면 트랜잭션 종료 시 JPA 더티 체킹으로 UPDATE 쿼리 실행
        campDesign.setDesignData(designDto);
    }

    @Override
    public void deleteCampDesign(String campId) {
        if (campDesignRepository.existsById(campId)) {
            campDesignRepository.deleteById(campId);
        }
    }

    // 💡 2. 다음 순번의 ID를 계산해내는 헬퍼 메서드
    private String generateNextItemId() {
        String maxId = campRepository.findMaxCampId(); // 예: "I0000005"

        if (maxId == null || maxId.isBlank()) {
            // DB에 데이터가 하나도 없다면 최초의 ID 리턴
            return "C0000001";
        }

        try {
            // "I0000005" 에서 알파벳 "I"를 잘라내고 숫자 "0000005" 문자열만 추출
            String numericPart = maxId.substring(1);
            // 숫자로 변환 (5) 한 뒤 1을 더함 (6)
            int nextNumber = Integer.parseInt(numericPart) + 1;

            // 다시 자릿수(7자리 영문 채움)를 맞춰서 포맷팅 -> "I0000006"
            return String.format("C%07d", nextNumber);
        } catch (Exception e) {
            // 혹시나 포맷이 깨진 기존 데이터가 있을 때를 대비한 방어 코드
            return "C0000001";
        }
    }
}
