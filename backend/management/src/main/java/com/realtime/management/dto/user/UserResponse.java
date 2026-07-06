package com.realtime.management.dto.user;

import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Roles;
import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {
    private String userId;
    private String userName;
    private String stat;
    private String deptCd;
    private String deptNm;
    private String roleCd;
    private String roleNm;
    private LocalDateTime createdAt;

    public static UserResponse from(Users users){
        return UserResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .stat(users.getStat())
                .roleCd(users.getRoles().getRoleCd())
                .roleNm(users.getRoles().getRoleNm())
                .deptCd(users.getDepts().getDeptCd())
                .deptNm(users.getDepts().getDeptNm())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
