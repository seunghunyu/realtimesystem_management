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
public class DataFormatId implements Serializable {
    @Column(name="format_id")
    private String formatId;

    @Column(name="field_nm")
    private String fieldNm;
}
