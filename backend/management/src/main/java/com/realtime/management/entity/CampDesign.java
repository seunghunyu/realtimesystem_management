package com.realtime.management.entity;

import com.realtime.management.dto.camp.CampDesignDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "camp_design")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CampDesign {
    @Id
    @Column(name = "camp_id")
    private String campId;

    @JdbcTypeCode(SqlTypes.JSON)
//    @Column(name = "design_data", columnDefinition = "json")
    @Column(name = "design_data")
    private CampDesignDto designData;
}
