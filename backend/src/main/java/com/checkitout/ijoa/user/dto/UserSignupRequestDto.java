package com.checkitout.ijoa.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserSignupRequestDto {

    @NotNull
    @NotBlank
    @Email
    @Schema(description = "이메일", example = "email@email.com")
    private String email;

    @NotNull
    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호는 8자에서 20자 사이여야 합니다.")
    @Schema(description = "비밀번호", example = "password123!")
    private String password;

    @NotNull
    @NotBlank
    @Size(min = 2, max = 10, message = "닉네임은 2자에서 10자 사이여야 합니다.")
    @Schema(description = "닉네임", example = "나는 바보다")
    private String nickname;
}
