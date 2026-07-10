package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="data_format_info")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataFormatInfo {
    @Id
    @Column(name="format_id")
    private String formatId;

    @Column(name="format_nm")
    private String formatNm;

    @Column
    private String formatDesc;

    @Builder.Default
    @OneToMany(mappedBy = "dataFormatInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DataFormatItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    public void update(String formatNm, String formatDesc, List<DataFormatItem> items){
        this.formatNm = formatNm;
        this.formatDesc = formatDesc;
        this.items.clear();
        if (items != null) {
            for (DataFormatItem item : items) {
                // 연관관계 편의 메서드 역할을 함께 수행하도록 강제
                this.items.add(item);
            }
        }
    }
}
