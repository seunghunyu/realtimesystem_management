package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "item_cd_tbl_map")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCdTblMap {
    @EmbeddedId
    private ItemCdTblMapId id;

    // 복합키 내부의 cd_tbl_id 컬럼을 외래키(FK) 매핑으로 사용하겠다는 의미입니다.
    @MapsId("cdTblId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cd_tbl_id")
    private ItemCdTblInfo itemCdTblInfo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
