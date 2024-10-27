package com.checkitout.ijoa.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class LoginRequestDto {

    @Schema(description = "이메일", example = "email@email.com")
    private String email;

    @Schema(description = "비밀번호", example = "password123!")
    private String password;
}
