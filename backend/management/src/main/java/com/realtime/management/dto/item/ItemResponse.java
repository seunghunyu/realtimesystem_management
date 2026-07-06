package com.realtime.management.dto.item;

import com.realtime.management.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ItemResponse {
    private String userId;
    private String userName;
    private String stat;
    private LocalDateTime createdAt;

    public static ItemResponse from(Users users){
        return ItemResponse.builder()
                .userId(users.getUserId())
                .userName(users.getUserName())
                .stat(users.getStat())
                .createdAt(users.getCreatedAt())
                .build();
    }
}
