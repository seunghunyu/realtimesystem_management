package com.realtime.management.entity;

import com.realtime.management.dto.camp.CampRequest;
import com.realtime.management.dto.camp.SchedulerData;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "camp_sch_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampSchInfo {

    @EmbeddedId
    private CampSchInfoId id; //schId + campId 복합 키

    @Column(name = "sch_nm")
    private String schNm;

    @Builder.Default
    @Column(name = "obj_kind")
    private String objKind = "realtime";

    @Column(name = "sch_desc")
    private String schDesc;

    @Column(name = "str_dt")
    private String strDt;

    @Column(name = "end_dt")
    private String endDt;

    @Column(name = "str_tm")
    private String strTm;

    @Column(name = "end_tm")
    private String endTm;

    // 💡 부모 엔티티(CampInfo)와의 연관관계 및 MapsId 매핑
    @MapsId("campId") // CampSchInfoId 내부의 campId 필드와 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id")
    private Camp camp;

    public void update(SchedulerData schedulerData){
        this.schNm = schedulerData.getSchNm();
        this.schDesc = schedulerData.getSchDesc();
        this.strDt = schedulerData.getStrDt();
        this.endDt = schedulerData.getEndDt();
        this.strTm = schedulerData.getStrTm();
        this.endTm = schedulerData.getEndTm();
    }
}
