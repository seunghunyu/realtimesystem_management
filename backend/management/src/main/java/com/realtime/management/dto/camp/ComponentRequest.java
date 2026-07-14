package com.realtime.management.dto.camp;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComponentRequest {

    private String cmpntId;

    private String cmpntNm;

    private String cmpntDesc;

    private String campId;

    private String fromCmpntId;

}
