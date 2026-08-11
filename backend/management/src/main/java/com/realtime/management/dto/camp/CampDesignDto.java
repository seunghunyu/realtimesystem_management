package com.realtime.management.dto.camp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CampDesignDto {
    private List<Map<String, Object>> nodes;
    private List<Map<String, Object>> edges;
}
