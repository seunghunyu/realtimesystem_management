package com.realtime.management.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // Common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C001", "서버 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 요청입니다."),

    // Users
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "U002", "이미 존재하는 사용자입니다."),
    
    // Depts
    DEPT_NOT_FOUND(HttpStatus.NOT_FOUND, "D001", "부서를 찾을 수 없습니다."),
    DEPT_ALREADY_EXISTS(HttpStatus.CONFLICT, "D002", "이미 존재하는 부서입니다."),

    // Roless
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "역할을 찾을 수 없습니다."),
    ROLE_ALREADY_EXISTS(HttpStatus.CONFLICT, "R002", "이미 존재하는 역할입니다."),

    // System Variables
    SYSVARS_NOT_FOUND(HttpStatus.NOT_FOUND, "SV001", "시스템 변수를 찾을 수 없습니다."),
    SYSVARS_ALREADY_EXISTS(HttpStatus.CONFLICT, "SV002", "이미 존재하는 시스템 변수입니다."),

    // System Variables
    ITEMS_NOT_FOUND(HttpStatus.NOT_FOUND, "I001", "아이템을 찾을 수 없습니다."),
    ITEMS_ALREADY_EXISTS(HttpStatus.CONFLICT, "I002", "이미 존재하는 아이템입니다."),

    // System Variables
    CDTBL_NOT_FOUND(HttpStatus.NOT_FOUND, "CDT001", "코드 테이블을 찾을 수 없습니다."),
    CDTBL_ALREADY_EXISTS(HttpStatus.CONFLICT, "CDT002", "이미 존재하는 코드 테이블입니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
