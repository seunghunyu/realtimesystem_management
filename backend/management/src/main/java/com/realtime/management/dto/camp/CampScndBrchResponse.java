package com.realtime.management.dto.camp;

import com.realtime.management.entity.CampBrch;
import com.realtime.management.entity.CampScndBrch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CampScndBrchResponse {
    private String scndBrchCd;
    private String scndBrchNm;
    private String brchCd;
    private String useCd;

    public static CampScndBrchResponse from(CampScndBrch campScndBrch){
        return CampScndBrchResponse.builder()
                .scndBrchCd(campScndBrch.getId().getScndBrchCd())
                .scndBrchNm(campScndBrch.getScndBrchNm())
                .brchCd(campScndBrch.getId().getBrchCd())
                .useCd(campScndBrch.getUserCd())
                .build();
    }
}
