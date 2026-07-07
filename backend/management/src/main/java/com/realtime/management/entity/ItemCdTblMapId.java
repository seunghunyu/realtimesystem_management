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

    @Column(name = "item_nm")
    private String itemNm;

    @Column(name = "cd_tbl_id")
    private String cdTblId;

}
