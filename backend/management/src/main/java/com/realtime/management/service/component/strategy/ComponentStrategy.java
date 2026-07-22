package com.realtime.management.service.component.strategy;

import com.realtime.management.dto.camp.ComponentRequest;
import com.realtime.management.dto.camp.ComponentResponse;

public interface ComponentStrategy {
    String getObjKind(); // "batch", "realtime", "filtering" ... 구분 값
    ComponentResponse save(ComponentRequest request);
    ComponentResponse update(ComponentRequest request);
    void delete(ComponentRequest request);
    ComponentResponse findById(ComponentRequest request);
}
