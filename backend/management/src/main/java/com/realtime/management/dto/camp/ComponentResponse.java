package com.realtime.management.dto.camp;

import com.realtime.management.entity.Component;
import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ComponentResponse {
    private String cmpntId;

    private String cmpntNm;

    private String cmpntDesc;

    private String campId;

    private String fromCmpntId;

    public static ComponentResponse from(Component component){
        return ComponentResponse.builder()
                .cmpntId(component.getCmpntId())
                .cmpntNm(component.getCmpntNm())
                .cmpntDesc(component.getCmpntDesc())
                .campId((component.getCamp() != null) ? component.getCamp().getCampId() : "")
                .build();
    }
}
