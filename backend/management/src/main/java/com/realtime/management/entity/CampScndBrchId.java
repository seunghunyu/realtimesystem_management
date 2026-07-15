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
public class CampScndBrchId implements Serializable {
    @Column(name = "scnd_brch_cd")
    private String scndBrchCd;

    @Column(name = "brch_cd")
    private String brchCd;
}
