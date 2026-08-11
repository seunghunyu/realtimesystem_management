package com.realtime.management.dto.camp;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor  // 💡 Jackson 역직렬화를 위한 기본 생성자 생성
@AllArgsConstructor // 💡 @Builder와 @NoArgsConstructor 함께 사용 시 필수
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

    @Override
    public String toString() {
        return "SchedulerData{" +
                "schId='" + schId + '\'' +
                ", schNm='" + schNm + '\'' +
                ", schDesc='" + schDesc + '\'' +
                ", campId='" + campId + '\'' +
                ", objKind='" + objKind + '\'' +
                ", strDt='" + strDt + '\'' +
                ", endDt='" + endDt + '\'' +
                ", strTm='" + strTm + '\'' +
                ", endTm='" + endTm + '\'' +
                ", times=" + times +
                '}';
    }
}
