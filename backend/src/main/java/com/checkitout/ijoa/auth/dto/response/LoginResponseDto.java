package com.checkitout.ijoa.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class LoginResponseDto {

    @Schema(description = "사용자 Id(자녀 프로필인 경우, 자녀 Id)", example = "1")
    private Long userId;

    @Schema(description = "사용자의 이름(자녀 프로필인 경우, 자녀 이름)", example = "아이조아")
    private String nickname;

    @Schema(description = "인증에 사용되는 액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @Schema(description = "새로운 액세스 토큰을 발급받기 위한 리프레시 토큰", example = "dGhpc0lzQVJFRGVtb1JlZnJlc2hUb2tlbg==")
    private String refreshToken;

    public LoginResponseDto(Long userId, String accessToken, String refreshToken) {
        this.userId = userId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.nickname = "";
    }
}
