package com.checkitout.ijoa.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@Schema(description = "집중한 단어 타이포그래피 요청")
public class TypographyRequest {

    @NotNull(message = "개수는 필수 입력 값입니다.")
    @Positive(message = "개수는 양수여야 합니다.")
    @Schema(description = "개수", example = "5")
    private Integer count;
}
