package com.realtime.management.dto.camp;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CampRequest {

    private String campId;

    private String campNm;

    private String campDesc;

    private String campType;

    private String campStat;

}
