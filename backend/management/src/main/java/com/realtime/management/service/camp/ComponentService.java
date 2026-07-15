package com.realtime.management.service.camp;

import com.realtime.management.dto.camp.CampRequest;
import com.realtime.management.dto.camp.ComponentRequest;
import com.realtime.management.dto.camp.ComponentResponse;

import java.util.List;


public interface ComponentService {
    ComponentResponse save(ComponentRequest request);
    ComponentResponse update(String cmpntId, ComponentRequest request);
    void delete(String cmpntId);
    ComponentResponse findById(String cmpntId);
    List<ComponentResponse> findAll();
}
