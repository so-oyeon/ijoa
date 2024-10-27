package com.checkitout.ijoa.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenReissueResponseDto {

    @Schema(description = "인증에 사용되는 액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @Schema(description = "새로운 액세스 토큰을 발급받기 위한 리프레시 토큰", example = "dGhpc0lzQVJFRGVtb1JlZnJlc2hUb2tlbg==")
    private String refreshToken;

    public static TokenReissueResponseDto of(LoginResponseDto loginResponse) {
        return new TokenReissueResponseDto(
                loginResponse.getAccessToken(),
                loginResponse.getRefreshToken()
        );
    }
}
