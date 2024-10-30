package com.checkitout.ijoa.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Builder
@Schema(description = "공통 응답")
public class ResultResponseDto<T> {

    @Schema(description = "응답 데이터")
    private T result;

    public static <T> ResultResponseDto<T> from(T result) {
        return ResultResponseDto.<T>builder()
                .result(result)
                .build();
    }

    @Builder
    public ResultResponseDto(T result) {
        this.result = result;
    }

}
