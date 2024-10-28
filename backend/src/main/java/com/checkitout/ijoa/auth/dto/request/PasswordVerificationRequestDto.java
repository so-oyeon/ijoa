package com.checkitout.ijoa.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PasswordVerificationRequestDto {

    @Schema(description = "비밀번호", example = "password123!")
    private String password;
}
