package com.realtime.management.dto.roles;

import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Roles;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RolesResponse {
    private String roleCd;
    private String roleNm;
    private LocalDateTime createdAt;

    public static RolesResponse from(Roles roles){
        return RolesResponse.builder()
                .roleCd(roles.getRoleCd())
                .roleNm(roles.getRoleNm())
                .createdAt(roles.getCreatedAt())
                .build();
    }
}
