package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "camp_brch")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampBrch {
    @Id
    @Column(name = "brch_cd")
    private String brchCd;

    @Column(name = "brch_nm")
    private String brchNm;

    @Column(name = "use_cd")
    private String userCd;

    //1:N 관계 설정(대분류 하나에 소분류 여러 개)
    @Builder.Default
    @OneToMany(mappedBy = "campBrch", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<CampScndBrch> scndBrchList = new ArrayList<>();

}
