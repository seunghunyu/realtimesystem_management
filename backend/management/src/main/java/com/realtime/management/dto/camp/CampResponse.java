package com.realtime.management.dto.camp;

import com.realtime.management.entity.Camp;
import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CampResponse {
    private String campId;

    private String campNm;

    private String campDesc;

    private String campType;

    private String campStat;

    private LocalDateTime createdAt;

    public static CampResponse from(Camp camp){
        return CampResponse.builder()
                .campId(camp.getCampId())
                .campNm(camp.getCampNm())
                .campDesc(camp.getCampDesc())
                .createdAt(camp.getCreatedAt())
                .build();
    }
}
