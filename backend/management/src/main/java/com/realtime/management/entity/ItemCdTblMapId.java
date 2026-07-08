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
public class ItemCdTblMapId implements Serializable {

    @Column(name = "cd_tbl_id")
    private String cdTblId;

    @Column(name = "cd_id")
    private String cdId;

    @Column(name = "cd_nm")
    private String cdNm;

}
