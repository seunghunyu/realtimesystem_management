package com.realtime.management.service.component;

import com.realtime.management.dto.camp.ComponentRequest;
import com.realtime.management.dto.camp.ComponentResponse;

import java.util.List;


public interface ComponentService {
    ComponentResponse save(ComponentRequest request);
    ComponentResponse update(ComponentRequest request);
    void delete(ComponentRequest request);

    ComponentResponse findById(String cmpntId);
    List<ComponentResponse> findAll();


}
