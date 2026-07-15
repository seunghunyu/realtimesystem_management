package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "camp_scnd_brch")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampScndBrch {
    @EmbeddedId
    private CampScndBrchId id;

    @Column(name = "scnd_brch_nm")
    private String scndBrchNm;

    @Column(name = "use_cd")
    private String userCd;

    //N:1 관계 설정 및 외래키 매핑
    @MapsId("brchCd")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="brch_cd", nullable = false)
    private CampBrch campBrch;

}
