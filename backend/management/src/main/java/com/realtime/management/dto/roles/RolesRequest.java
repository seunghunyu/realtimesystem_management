package com.realtime.management.dto.roles;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RolesRequest {
    @NotBlank
    private String roleCd;

    @NotBlank
    private String roleNm;
}
