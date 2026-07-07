package com.realtime.management.dto.item;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequest {
    private String itemId;

    @NotBlank
    private String itemNm;

    private String itemAlias;

    @NotBlank
    private String itemType;

    private String itemDesc;

    private String cdTblId;

}
