package com.realtime.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sys_cd_mng")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SysVars {
    @Id
    @Column(name = "sys_cd")
    private String sysCd;

    @Column(name = "sys_nm")
    private String sysNm;

    @Column(name = "sys_desc")
    private String sysDesc;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void update(String sysNm, String sysDesc){
        this.sysNm = sysNm;
        this.sysDesc = sysDesc;
    }
}
