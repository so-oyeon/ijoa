package com.checkitout.ijoa.fairytale.dto;

import static java.time.LocalDateTime.now;

import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@Schema(description = "시선추척 데이터 요청")
public class PageHistoryCreationRequest {

    @NotNull(message = "화면 밖 응시 여부는 필수 항목입니다.")
    @Schema(description = "화면 밖 응시 여부", example = "false")
    private Boolean isGazeOutOfScreen;

    @Schema(description = "집중도", example = "1.0")
    private Float attentionRate;

    @Schema(description = "단어", example = "사과")
    private String word;

    @NotNull(message = "그림 여부는 필수 항목입니다.")
    @Schema(description = "그림 여부", example = "false")
    private Boolean isImage;

    public EyeTrackingData toEntity(PageHistory pageHistory) {
        return EyeTrackingData.of(now(), isGazeOutOfScreen, attentionRate, word, isImage, pageHistory);
    }
}