package com.checkitout.ijoa.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PageRequestDto {

    @Schema(description = "페이지 번호 (1 부터 시작)", example = "1")
    @NotNull(message = "페이지는 필수 항목입니다")
    @Positive(message = "페이지는 양수여야합니다")
    private int page;

    @Schema(description = "페이지 크기", example = "5")
    @NotNull(message = "페이지 크기는 필수 항목입니다")
    @Positive(message = "페이지 크기는 양수여야합니다")
    private int size;
}
