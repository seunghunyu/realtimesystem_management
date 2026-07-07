package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Items {
    @Id
    @Column(name = "item_id")
    private String itemId;

    @Column(name = "item_nm")
    private String itemNm;

    @Column(name = "item_alias")
    private String itemAlias;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "item_desc")
    private String itemDesc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cd_tbl_id")
    private ItemCdTblInfo itemCdTblInfo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void update(String itemAlias, String itemType, String itemDesc, ItemCdTblInfo itemCdTblInfo){
        this.itemAlias = itemAlias;
        this.itemType = itemType;
        this.itemDesc = itemDesc;
        this.itemCdTblInfo = itemCdTblInfo;
    }
}
