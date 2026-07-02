package com.realtime.management.dto.item;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String userName;

    private String role;

    private String stat;

    private String deptCd;

}
