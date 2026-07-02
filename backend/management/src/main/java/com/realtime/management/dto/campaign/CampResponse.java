package com.realtime.management.dto.campaign;

import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CampResponse {
    private String userId;
    private String userName;
    private String role;
    private String stat;
    private String deptCd;
    private LocalDateTime createdAt;

    public static CampResponse from(Users users){
        return CampResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .role(users.getRole())
                .stat(users.getStat())
                .deptCd(users.getDeptCd())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
