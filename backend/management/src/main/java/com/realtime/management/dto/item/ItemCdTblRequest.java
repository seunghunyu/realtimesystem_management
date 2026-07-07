package com.realtime.management.dto.item;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemCdTblRequest {

    private String cdTblId;

    @NotBlank
    private String cdTblNm;

    private String cdTblDesc;


}
