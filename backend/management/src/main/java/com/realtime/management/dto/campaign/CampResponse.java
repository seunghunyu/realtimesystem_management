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
    private String stat;
    private LocalDateTime createdAt;

    public static CampResponse from(Users users){
        return CampResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .stat(users.getStat())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
