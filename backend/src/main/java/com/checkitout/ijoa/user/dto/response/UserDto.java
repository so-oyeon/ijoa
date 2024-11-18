package com.checkitout.ijoa.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UserDto {

    @Schema(description = "사용자 Id", example = "1")
    private Long userId;

    @Schema(description = "사용자 email", example = "email@email.com")
    private String email;

    @Schema(description = "닉네임", example = "아이조아")
    private String nickname;
}
