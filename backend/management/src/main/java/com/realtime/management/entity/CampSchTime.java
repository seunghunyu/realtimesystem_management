package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "camp_sch_time")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampSchTime {

    @EmbeddedId
    private CampSchTimeId id;

    // camp_sch_info 테이블과의 연관관계(sch_id 매핑)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "sch_id", referencedColumnName = "sch_id"),
            @JoinColumn(name = "camp_id", referencedColumnName = "camp_id")
    })
    private CampSchInfo schInfo;

}

