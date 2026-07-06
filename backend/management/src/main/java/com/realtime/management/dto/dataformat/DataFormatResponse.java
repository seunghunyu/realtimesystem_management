package com.realtime.management.dto.dataformat;

import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DataFormatResponse {
    private String userId;
    private String userName;
    private String stat;
    private LocalDateTime createdAt;

    public static DataFormatResponse from(Users users){
        return DataFormatResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .stat(users.getStat())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
