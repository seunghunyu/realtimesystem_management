package com.realtime.management.entity;

import com.realtime.management.dto.camp.CampRequest;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "camp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Camp {
    @Id
    @Column(name = "camp_id")
    private String campId;

    @Column(name = "camp_nm")
    private String campNm;

    @Column(name = "camp_desc")
    private String campDesc;

    @Column(name = "camp_brch1")
    private String campBrch1;

    @Column(name = "camp_brch2")
    private String campBrch2;

    @Column(name = "camp_type")
    @Builder.Default
    private String campType = "real";

    @Column(name = "camp_stat")
    @Builder.Default
    private String campStat = "100";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

//    public void update(String campName, String campStat, String campDesc, String campBrch1, String campBrch2){
    public void update(CampRequest request){
        this.campNm = request.getCampNm();
        this.campStat = request.getCampStat();
        this.campDesc = request.getCampDesc();
        this.campBrch1 = request.getCampBrch1();
        this.campBrch2 = request.getCampBrch2();
    }
}
