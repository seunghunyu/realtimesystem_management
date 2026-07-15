package com.realtime.management.dto.camp;

import com.realtime.management.entity.CampBrch;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class HierarchyBrchResponse {
    private String brchCd;
    private String brchNm;
    private String useCd;
    private List<ScndBrchDto> scndBrchs;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class ScndBrchDto{
        private String scndBrchCd;
        private String scndBrchNm;
        private String useCd;
    }

    public static HierarchyBrchResponse from(CampBrch campBrch){
        List<ScndBrchDto> scndBrchDtoList = campBrch.getScndBrchList() == null ? List.of() :
                campBrch.getScndBrchList().stream()
                        .map(scndBrch -> ScndBrchDto.builder()
                                .scndBrchCd(scndBrch.getId().getScndBrchCd()) // 복합키에서 추출
                                .scndBrchNm(scndBrch.getScndBrchNm())
                                .useCd(scndBrch.getUserCd())
                                .build())
                        .toList();
        return HierarchyBrchResponse.builder()
                .brchCd(campBrch.getBrchCd())
                .brchNm(campBrch.getBrchNm())
                .useCd(campBrch.getUserCd())
                .scndBrchs(scndBrchDtoList)
                .build();
    }

}
