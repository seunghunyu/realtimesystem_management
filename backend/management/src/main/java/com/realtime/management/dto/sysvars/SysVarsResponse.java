package com.realtime.management.dto.sysvars;

import com.realtime.management.dto.user.UserResponse;
import com.realtime.management.entity.SysVars;
import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
@Builder
public class SysVarsResponse {
    private String sysCd;
    private String sysNm;
    private String sysDesc;

    private LocalDateTime createdAt;

    public static SysVarsResponse from(SysVars sysVars) {
        return SysVarsResponse.builder()
                .sysCd(sysVars.getSysCd())
                .sysNm(sysVars.getSysNm())
                .sysDesc(sysVars.getSysDesc())
                .createdAt(sysVars.getCreatedAt())
                .build();
    }
}
