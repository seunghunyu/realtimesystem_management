package com.realtime.management.service.camp;

import com.realtime.management.dto.camp.ComponentRequest;
import com.realtime.management.dto.camp.ComponentResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ComponentServiceImpl implements ComponentService{
    @Override
    public ComponentResponse save(ComponentRequest request) {
        return null;
    }

    @Override
    public ComponentResponse update(String cmpntId, ComponentRequest request) {
        return null;
    }

    @Override
    public void delete(String cmpntId) {

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
