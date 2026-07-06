package com.realtime.management.service.depts;

import com.realtime.management.dto.dept.DeptsRequest;
import com.realtime.management.dto.dept.DeptsResponse;
import com.realtime.management.entity.Depts;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.DeptsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DetpsServiceImpl implements DeptsService {
    private final DeptsRepository deptRepository;

    @Override
    public DeptsResponse save(DeptsRequest request) {
        if(deptRepository.existsById(request.getDeptCd())){
            throw new BusinessException(ErrorCode.DEPT_ALREADY_EXISTS);
        }
        Depts depts = Depts.builder()
                .deptCd(request.getDeptCd())
                .deptNm(request.getDeptNm())
                .createdAt(LocalDateTime.now())
                .build();
        deptRepository.save(depts);

        return DeptsResponse.from(depts);
    }

    @Override
    public DeptsResponse update(String userId, DeptsRequest request) {


        Depts depts = deptRepository.findById(request.getDeptCd())
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND)); // (부서 없을 때 예외처리 추가)

        depts.update(depts.getDeptCd(), request);

        return DeptsResponse.from(depts);
    }

    @Override
    public void delete(String deptCd) {
        Depts depts = deptRepository.findById(deptCd)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND));

        deptRepository.delete(depts);
    }

    @Override
    public DeptsResponse findById(String userId) {
        Depts depts = deptRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPT_NOT_FOUND));
        return DeptsResponse.from(depts);
    }

    @Override
    public List<Depts> findAll() {
        return deptRepository.findAll();
    }
}
