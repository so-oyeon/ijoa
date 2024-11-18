package com.checkitout.ijoa.statistics.dto;

import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "분류별 독서 통계 응답")
public class CategoryStatisticsResponse {

    @Schema(description = "분류", example = "의사소통")
    private final String category;

    @Schema(description = "횟수", example = "20")
    private final Long count;

    public static CategoryStatisticsResponse of(CATEGORY category, Long count) {
        return CategoryStatisticsResponse.builder()
                .category(category.getDisplayName())
                .count(count)
                .build();
    }
}
