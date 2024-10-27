package com.checkitout.ijoa.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    //user
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER-001", "사용자를 찾을 수 없습니다."),

    //auth
    INVALID_JWT_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-001", "유효하지 않은 JWT 토큰입니다."),
    PASSWORD_MISMATCH(HttpStatus.UNAUTHORIZED, "AUTH-002", "비밀번호가 일치하지 않습니다."),

    //email
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "EMAIL-001", "이미 사용 중인 이메일입니다."),
    EMAIL_VERIFICATION_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "EMAIL-002", "인증번호 발송에 실패했습니다."),
    EMAIL_VERIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "EMAIL-003", "유효하지 않은 이메일입니다."),
    INVALID_EMAIL_VERIFICATION_CODE(HttpStatus.BAD_REQUEST, "EMAIL-004", "유효하지 않은 인증 코드입니다.");


    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
