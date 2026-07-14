package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "component")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Component {
    @Id
    @Column(name = "cmpnt_id")
    private String cmpntId;

    @Column(name = "cmpnt_nm")
    private String cmpntNm;

    @Column(name = "cmpnt_desc")
    private String cmpntDesc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id")
    private Camp camp;

    @Column(name = "from_cmpnt_id")
    private String fromCmpntId;

    public void update(String cmpntNm, String cmpntDesc, String fromCmpntId, Camp camp){
        this.cmpntNm = cmpntNm;
        this.cmpntDesc = cmpntDesc;
        this.fromCmpntId = fromCmpntId;
        this.camp = camp;
    }
}
