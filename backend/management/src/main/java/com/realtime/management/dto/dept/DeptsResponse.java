package com.realtime.management.dto.dept;

import com.realtime.management.entity.Depts;
import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DeptsResponse {
    private String deptCd;
    private String deptNm;
    private LocalDateTime createdAt;

    public static DeptsResponse from(Depts depts){
        return DeptsResponse.builder()
                .deptCd(depts.getDeptCd())
                .deptNm(depts.getDeptNm())
                .createdAt(depts.getCreatedAt())
                .build();
    }
}
