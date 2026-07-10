package com.realtime.management.dto.dataformat;

import com.realtime.management.entity.DataFormatItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataFormatItemResponse {
    private String fieldNm;
    private String fieldVal;
    private String fieldType;

    // 엔티티를 DTO로 변환하는 헬퍼 메서드
    public static DataFormatItemResponse from(DataFormatItem item) {
        return DataFormatItemResponse.builder()
                .fieldNm(item.getId().getFieldNm()) // 복합키 아이디에서 추출
                .fieldVal(item.getFieldVal())
                .fieldType(item.getFieldType())
                .build();
    }
}