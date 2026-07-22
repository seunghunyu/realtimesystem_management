package com.realtime.management.service.component;

import com.realtime.management.dto.camp.ComponentRequest;
import com.realtime.management.dto.camp.ComponentResponse;
import com.realtime.management.exception.BusinessException;
import com.realtime.management.exception.ErrorCode;
import com.realtime.management.repository.CampRepository;
import com.realtime.management.service.component.strategy.ComponentStrategy;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ComponentServiceImpl implements ComponentService{

    private final CampRepository campRepository;
    // 💡 Spring이 ComponentStrategy를 구현한 모든 빈을 List로 자동 주입해줍니다.
    private final List<ComponentStrategy> strategies;

    @Override
    @Transactional
    public ComponentResponse save(ComponentRequest request) {
        ComponentStrategy strategy = strategies.stream()
                .filter(s -> s.getObjKind().equalsIgnoreCase(request.getCmpntType()))
                .findFirst()
                .orElseThrow(()-> new BusinessException(ErrorCode.CMPNT_NOT_SUPPORTED));

        return strategy.save(request);
    }

    @Override
    public ComponentResponse update(ComponentRequest request) {
        ComponentStrategy strategy = strategies.stream()
                .filter(s -> s.getObjKind().equalsIgnoreCase(request.getCmpntType()))
                .findFirst()
                .orElseThrow(()-> new BusinessException(ErrorCode.CMPNT_NOT_SUPPORTED));
        return strategy.update(request);
    }

    @Override
    public void delete(ComponentRequest request) {
        ComponentStrategy strategy = strategies.stream()
                .filter(s -> s.getObjKind().equalsIgnoreCase(request.getCmpntType()))
                .findFirst()
                .orElseThrow(()-> new BusinessException(ErrorCode.CMPNT_NOT_SUPPORTED));
        strategy.delete(request);
    }

    @Override
    public ComponentResponse findById(String cmpntId) {
        return null;
    }

    @Override
    public List<ComponentResponse> findAll() {
        return List.of();
    }
}
