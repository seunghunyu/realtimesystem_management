package com.realtime.management.dto.camp;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class SchedulerData {
    private String schId;
    private String schNm;
    private String schDesc;
    private String campId;
    private String objKind;
    private String strDt;
    private String endDt;
    private String strTm;
    private String endTm;
    private List<String> times;
}
