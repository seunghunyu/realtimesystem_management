package com.realtime.management.dto.dataformat;

import com.realtime.management.dto.item.ItemCdTblRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class DataFormatRequest {
    private String formatId;

    @NotBlank
    private String formatNm;

    private String formatDesc;

    private List<FieldInfo> fieldInfos;

    private LocalDateTime createdAt;

    /**
     * 💡 프론트엔드의 객체 배열 내부 아이템과 1:1 매핑될 내부 DTO 클래스
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldInfo {
        private String fieldNm;   // 프론트의 fieldId 매핑
        private String fieldVal;  // 프론트의 fieldNm과 매핑
        private String fieldType; // 프론트의 fieldType과 매핑
    }

}
