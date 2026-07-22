package com.realtime.management.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "camp_filter_condition")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampFilterCondition {
    @EmbeddedId
    private CampFilterConditionId id;

    @MapsId("cmpntId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cmpnt_id")
    private Cmpnt cmpnt;

    @MapsId("campId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id")
    private Camp camp;

    @MapsId("filterId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filter_id")
    private FilterCondition filterCondition;
}
