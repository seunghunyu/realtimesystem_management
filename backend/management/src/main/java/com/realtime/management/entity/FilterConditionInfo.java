package com.realtime.management.entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "filter_condition_info")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterConditionInfo {
    @EmbeddedId
    private FilterConditionInfoId id;

    @Column(name = "info")
    private String info;

    @MapsId("filterId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filter_id")
    private FilterCondition filterCondition;

}
