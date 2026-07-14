package com.realtime.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "camp_data_format")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampDataFormat {
    @EmbeddedId
    private CampDataFormatId id;

    @MapsId("cmpntId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cmpnt_id")
    private Component component;

    @MapsId("campId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camp_id")
    private Camp camp;

    @MapsId("formatId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "format_id")
    private DataFormatInfo dataFormatInfo;
}
