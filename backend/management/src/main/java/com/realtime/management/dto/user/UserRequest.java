package com.realtime.management.dto.user;

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

    private String roleCd;

    private String stat;

    private String deptCd;



}
