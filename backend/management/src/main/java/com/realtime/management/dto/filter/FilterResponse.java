package com.realtime.management.dto.filter;

import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FilterResponse {
    private String userId;
    private String userName;
    private String role;
    private String stat;
    private String deptCd;
    private LocalDateTime createdAt;

    public static FilterResponse from(Users users){
        return FilterResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .role(users.getRole())
                .stat(users.getStat())
                .deptCd(users.getDeptCd())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
