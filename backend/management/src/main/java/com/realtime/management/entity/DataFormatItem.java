package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "data_format_item")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataFormatItem {
    @EmbeddedId
    private DataFormatId id;

    @Column(name = "field_val")
    private String fieldVal;

    @Column(name = "field_type")
    private String fieldType;

    @MapsId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "format_id")
    private DataFormatInfo dataFormatInfo;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
