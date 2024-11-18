package com.checkitout.ijoa.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EmailVerificationRequestDto {

    @Schema(description = "이메일", example = "email@email.com")
    private String email;

    @Schema(description = "인증코드", example = "IH6325")
    private String authCode;
}
