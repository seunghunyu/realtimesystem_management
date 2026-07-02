package com.realtime.management.dto.user;

import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {
    private String userId;
    private String userName;
    private String role;
    private String stat;
    private String deptCd;
    private LocalDateTime createdAt;

    public static UserResponse from(Users users){
        return UserResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .role(users.getRole())
                .stat(users.getStat())
                .deptCd(users.getDeptCd())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
