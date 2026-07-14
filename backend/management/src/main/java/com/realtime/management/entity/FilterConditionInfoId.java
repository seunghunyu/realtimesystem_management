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
public class FilterConditionInfoId implements Serializable {
    @Column(name = "filter_id")
    private String filterId;

    @Column(name = "seq")
    private Long seq;
}
