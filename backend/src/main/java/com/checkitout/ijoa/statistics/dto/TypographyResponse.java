package com.checkitout.ijoa.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "집중한 단어 타이포그래피 응답")
public class TypographyResponse {

    @Schema(description = "단어", example = "사과")
    private final String word;

    @Schema(description = "횟수", example = "5")
    private final Integer focusCount;

    public static TypographyResponse test(String word, Integer focusCount) {
        return TypographyResponse.builder()
                .word(word)
                .focusCount(focusCount)
                .build();
    }
}
