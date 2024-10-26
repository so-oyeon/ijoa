package com.checkitout.ijoa.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    //user
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER-001", "사용자를 찾을 수 없습니다."),

    //email
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "EMAIL-001", "이미 사용 중인 이메일입니다."),
    EMAIL_VERIFICATION_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "EMAIL-002", "인증번호 발송에 실패했습니다.");


    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
