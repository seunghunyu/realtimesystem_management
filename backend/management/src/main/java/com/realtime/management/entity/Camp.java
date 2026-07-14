package com.realtime.management.entity;

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
    private String campName;

    @Column(name = "camp_desc")
    private String campDesc;

    @Column(name = "camp_type")
    @Builder.Default
    private String campType = "real";

    @Column(name = "camp_stat")
    @Builder.Default
    private String campStat = "100";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void update(String campName, String campStat, String campDesc){
        this.campName = campName;
        this.campStat = campStat;
        this.campDesc = campDesc;
    }
}
