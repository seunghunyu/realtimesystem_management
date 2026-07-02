package com.realtime.management.dto.campaign;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CampRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String userName;

    private String role;

    private String stat;

    private String deptCd;

}
