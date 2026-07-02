package com.realtime.management.dto;

import com.realtime.management.entity.User;
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

    public static UserResponse from(User user){
        return UserResponse.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .role(user.getRole())
                .stat(user.getStat())
                .deptCd(user.getDeptCd())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
