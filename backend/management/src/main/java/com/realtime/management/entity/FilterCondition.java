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
@Table(name = "filter_condition")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterCondition {
    @Id
    @Column(name = "filter_id")
    private String filterId;

    @Column(name = "filter_nm")
    private String filterNm;

    @Column(name = "filter_desc")
    private String filterDesc;

    @Builder.Default
    @OneToMany(mappedBy = "filterCondition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FilterConditionInfo> conditionInfos = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
