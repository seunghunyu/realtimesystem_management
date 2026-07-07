package com.realtime.management.dto.item;

import com.realtime.management.entity.ItemCdTblInfo;
import com.realtime.management.entity.Items;
import com.realtime.management.entity.Users;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ItemResponse {
    private String itemId;
    private String itemNm;
    private String itemAlias;
    private String itemType;
    private String itemDesc;
    private String cdTblId;
    private String cdTblNm;
    private LocalDateTime createdAt;

    public static ItemResponse from(Items items){
        return ItemResponse.builder()
                .itemId(items.getItemId())
                .itemNm(items.getItemNm())
                .itemAlias(items.getItemAlias())
                .itemType(items.getItemType())
                .itemDesc(items.getItemDesc())
                .cdTblId(items.getItemCdTblInfo() != null ? items.getItemCdTblInfo().getCdTblId() : null)
                .cdTblNm(items.getItemCdTblInfo() != null ? items.getItemCdTblInfo().getCdTblNm() : null)
                .createdAt(items.getCreatedAt())
                .build();
    }
}
