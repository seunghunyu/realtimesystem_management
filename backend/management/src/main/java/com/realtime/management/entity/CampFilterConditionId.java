package com.realtime.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CampFilterConditionId implements Serializable {
    @Column(name = "cmpnt_id")
    private String cmpntId;

    @Column(name = "camp_id")
    private String campId;

    @Column(name = "filter_id")
    private String filterId;

}
