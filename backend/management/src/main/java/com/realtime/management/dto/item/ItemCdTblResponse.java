package com.realtime.management.dto.item;

import com.realtime.management.entity.ItemCdTblInfo;
import com.realtime.management.entity.ItemCdTblMap;
import com.realtime.management.entity.Items;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter
@Builder
public class ItemCdTblResponse {
    private String cdTblId;
    private String cdTblNm;
    private String cdTblDesc;
    private LocalDateTime createdAt;
    
    public static ItemCdTblResponse from(ItemCdTblInfo itemCdTblInfo){
        return ItemCdTblResponse.builder()
                .cdTblId(itemCdTblInfo.getCdTblId())
                .cdTblNm(itemCdTblInfo.getCdTblNm())
                .cdTblDesc(itemCdTblInfo.getCdTblDesc())
                .createdAt(itemCdTblInfo.getCreatedAt())
                .build();
    }
}
