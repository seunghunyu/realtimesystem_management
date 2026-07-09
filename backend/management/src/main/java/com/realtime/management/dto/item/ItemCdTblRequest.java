package com.realtime.management.dto.item;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ItemCdTblRequest {

    private String cdTblId;

    @NotBlank
    private String cdTblNm;

    private String cdTblDesc;

//    @NotBlank
    // 💡 핵심: 프론트의 CodeValueItem[] 배열을 Java의 List 구조로 매핑합니다.
    private List<CodeValueItem> cdTblInfo;

    private LocalDateTime createdAt;

    /**
     * 💡 프론트엔드의 객체 배열 내부 아이템과 1:1 매핑될 내부 DTO 클래스
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeValueItem {
        private String cdId; // 프론트의 cdId와 매핑
        private String cdNm; // 프론트의 cdNm과 매핑
    }


}
