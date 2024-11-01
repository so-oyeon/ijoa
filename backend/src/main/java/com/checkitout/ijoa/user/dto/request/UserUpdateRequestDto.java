package com.checkitout.ijoa.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UserUpdateRequestDto {

    @Schema(description = "사용자 닉네임", example = "아이조아")
    private String nickname;

    @Schema(description = "비밀번호", example = "password123!")
    private String password;
}
