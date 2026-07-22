package com.realtime.management.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum GEN_KEY_CODE {
    // Common
    CAMP("camp", "C"),
    COMPONENT("component", "C"),

    ITEM("item", "I");

    private final String code;
    private final String prefix;

    GEN_KEY_CODE(String code, String prefix) {
        this.code = code;
        this.prefix = prefix;
    }
}
