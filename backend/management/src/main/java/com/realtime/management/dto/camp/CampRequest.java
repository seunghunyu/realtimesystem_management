package com.realtime.management.dto.camp;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CampRequest {

    private String campId;

    private String campNm;

    private String campDesc;

    private String campBrch1;

    private String campBrch2;

    private String campType;

    private String campStat;




}
