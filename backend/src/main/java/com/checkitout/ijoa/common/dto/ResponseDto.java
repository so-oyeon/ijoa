package com.checkitout.ijoa.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class ResponseDto {

    @Schema(description = "응답 상태", example = "SUCCESS")
    private String status;

    @Schema(description = "응답 메시지", example = "요청 처리 완료.")
    private String message;

    public ResponseDto() {
        this.status = "SUCCESS";
        this.message = "요청 처리 완료";
    }
}
