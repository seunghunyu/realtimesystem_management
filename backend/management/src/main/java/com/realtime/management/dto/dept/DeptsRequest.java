package com.realtime.management.dto.dept;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeptsRequest {
    @NotBlank
    private String deptCd;

    @NotBlank
    private String deptNm;
}
