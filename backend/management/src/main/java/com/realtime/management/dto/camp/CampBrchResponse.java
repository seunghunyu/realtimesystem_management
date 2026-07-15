package com.realtime.management.dto.camp;

import com.realtime.management.entity.CampBrch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CampBrchResponse {
    private String brchCd;
    private String brchNm;
    private String useCd;

    public static CampBrchResponse from(CampBrch campBrch){
        return CampBrchResponse.builder()
                .brchCd(campBrch.getBrchCd())
                .brchNm(campBrch.getBrchNm())
                .useCd(campBrch.getUserCd())
                .build();
    }
}
