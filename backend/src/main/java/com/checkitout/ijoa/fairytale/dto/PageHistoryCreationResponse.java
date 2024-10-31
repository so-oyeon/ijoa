package com.checkitout.ijoa.fairytale.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "시선추척 데이터 저장 응답")
public class PageHistoryCreationResponse {

    @Schema(description = "시선추적 데이터 ID", example = "1")
    private final Long eyeTrackingDataId;

    public static PageHistoryCreationResponse test() {
        return PageHistoryCreationResponse.builder()
                .eyeTrackingDataId(1L)
                .build();
    }
}
