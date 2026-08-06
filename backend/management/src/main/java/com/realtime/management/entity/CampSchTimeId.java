package com.realtime.management.entity;

import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CampSchTimeId implements Serializable {
    @Column(name = "sch_id")
    private String schId;

    @Column(name = "sch_time")
    private String schTime;
}
