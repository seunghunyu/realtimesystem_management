package com.realtime.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "item_cd_tbl_info")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCdTblInfo {
    @Id
    @Column(name = "cd_tbl_id")
    private String cdTblId;

    @Column(name = "cd_tbl_nm")
    private String cdTblNm;

    @Column(name = "cd_tbl_desc")
    private String cdTblDesc;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
