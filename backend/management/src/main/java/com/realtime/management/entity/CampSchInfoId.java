package com.realtime.management.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CampSchInfoId implements Serializable {
    private String schId;
    private String campId;
}

