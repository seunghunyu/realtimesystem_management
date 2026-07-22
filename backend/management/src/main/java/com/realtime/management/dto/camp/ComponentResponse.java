package com.realtime.management.dto.camp;

import com.realtime.management.entity.Cmpnt;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ComponentResponse {
    private String cmpntId;

    private String cmpntNm;

    private String cmpntDesc;

    private String campId;

    private String fromCmpntId;

    private SchedulerData schedulerData;
    private FilteringData filteringData;
    private DataFormatData dataFormatData;
    private CleansingData cleansingData;
    private MessageData messageData;
    private PushData pushData;

    public static ComponentResponse from(Cmpnt cmpnt){
        return ComponentResponse.builder()
                .cmpntId(cmpnt.getCmpntId())
                .cmpntNm(cmpnt.getCmpntNm())
                .cmpntDesc(cmpnt.getCmpntDesc())
                .campId((cmpnt.getCamp() != null) ? cmpnt.getCamp().getCampId() : "")
                .build();
    }
    // 💡 [추가] 스케줄러 전용 response 생성 메서드 (오버로딩)
    public static ComponentResponse from(Cmpnt cmpnt, SchedulerData schedulerData) {
        return ComponentResponse.builder()
                .cmpntId(cmpnt.getCmpntId())
                .cmpntNm(cmpnt.getCmpntNm())
                .cmpntDesc(cmpnt.getCmpntDesc())
                .campId((cmpnt.getCamp() != null) ? cmpnt.getCamp().getCampId() : "")
                .fromCmpntId(cmpnt.getFromCmpntId())
                .schedulerData(schedulerData)
                .build();
    }
}
