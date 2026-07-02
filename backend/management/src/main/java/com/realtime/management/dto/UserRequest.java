package com.realtime.management.dto;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String userName;

    private String role;

    private String stat;

    private String deptCd;

}
