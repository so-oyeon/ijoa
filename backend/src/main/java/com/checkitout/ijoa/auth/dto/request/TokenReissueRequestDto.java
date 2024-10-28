package com.checkitout.ijoa.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class TokenReissueRequestDto {

    @Schema(description = "새로운 액세스 토큰을 발급받기 위한 리프레시 토큰", example = "dGhpc0lzQVJFRGVtb1JlZnJlc2hUb2tlbg==")
    private String refreshToken;
}
