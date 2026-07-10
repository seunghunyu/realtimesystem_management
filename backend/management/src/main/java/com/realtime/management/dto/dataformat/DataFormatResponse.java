package com.realtime.management.dto.dataformat;

import com.realtime.management.entity.DataFormatInfo;
import com.realtime.management.entity.DataFormatItem;
import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class DataFormatResponse {
    private String formatId;
    private String formatNm;
    private String formatDesc;
    private List<DataFormatItem> items;
    private LocalDateTime createdAt;

    public static DataFormatResponse from(DataFormatInfo info){
        return DataFormatResponse.builder()
                .formatId(info.getFormatId())
                .formatNm(info.getFormatNm())
                .formatDesc(info.getFormatDesc())
                .items(info.getItems())
                .createdAt(info.getCreatedAt())
                .build();
    }
}
