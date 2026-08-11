package com.realtime.management.dto.camp;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.aspectj.bridge.Message;

@Getter
@Setter
public class ComponentRequest {

    private String cmpntId;

    private String cmpntNm;

    private String cmpntDesc;

    private String cmpntType;

    private String campId;

    private String fromCmpntId;

    private SchedulerData schedulerData;
    private FilteringData filteringData;
    private CleansingData cleansingData;
    private DataFormatData dataFormatData;
    private MessageData messageData;
    private PushData pushData;

    @Override
    public String toString() {
        return "ComponentRequest{" +
                "cmpntId='" + cmpntId + '\'' +
                ", cmpntNm='" + cmpntNm + '\'' +
                ", cmpntDesc='" + cmpntDesc + '\'' +
                ", cmpntType='" + cmpntType + '\'' +
                ", campId='" + campId + '\'' +
                ", fromCmpntId='" + fromCmpntId + '\'' +
                ", schedulerData=" + schedulerData +
                ", filteringData=" + filteringData +
                ", cleansingData=" + cleansingData +
                ", dataFormatData=" + dataFormatData +
                ", messageData=" + messageData +
                ", pushData=" + pushData +
                '}';
    }
}
