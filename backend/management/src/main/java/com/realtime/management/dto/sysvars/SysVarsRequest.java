package com.realtime.management.dto.sysvars;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SysVarsRequest {
    @NotBlank
    private String sysCd;

    @NotBlank
    private String sysNm;

    private String sysDesc;

}
