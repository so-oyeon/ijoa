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
    INVALID_EMAIL_VERIFICATION_CODE(HttpStatus.BAD_REQUEST, "EMAIL-004", "유효하지 않은 인증 코드입니다."),

    //child
    CHILD_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "CHILD-001", "자녀 프로필은 최대 10명까지 생성할 수 있습니다."),
    CHILD_NOT_FOUND(HttpStatus.NOT_FOUND, "CHILD-002", "자녀를 찾을 수 없습니다."),
    CHILD_NOT_BELONG_TO_PARENT(HttpStatus.FORBIDDEN, "CHILD-003", "자녀가 현재 로그인한 부모의 자녀가 아닙니다."),

    // fairytale
    FAIRYTALE_NOT_FOUND(HttpStatus.NOT_FOUND, "FAIRYTALE-001", "존재하지 않는 동화책입니다."),

    //file
    FILE_CONVERSION_ERROR(HttpStatus.BAD_REQUEST, "FILE-001", "파일 변환 에러가 발생했습니다."),

    //TTS
    TTS_NOT_FOUND(HttpStatus.NOT_FOUND,"TTS-001","TTS를 찾을 수 없습니다."),
    TTS_NO_CONTENT(HttpStatus.NO_CONTENT,"TTS-002", "TTS가 없습니다. "),
    TTS_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "TTS-003","TTS는 4개까지 생성할 수 있습니다."),
    UNAUTHORIZED_USER(HttpStatus.FORBIDDEN, "UU-001", "권한이 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
