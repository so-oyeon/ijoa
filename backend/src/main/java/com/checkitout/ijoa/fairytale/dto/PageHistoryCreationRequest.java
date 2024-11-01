package com.checkitout.ijoa.fairytale.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "시선추척 데이터 요청")
public class PageHistoryCreationRequest {

    @NotNull(message = "시선추적 시간은 필수 입력 값입니다.")
    @PastOrPresent(message = "시선추적 시간은 현재 또는 과거 날짜여야 합니다.")
    @Schema(description = "시선추적 시간", example = "2024-10-25T12:00:00Z")
    private LocalDateTime trackedAt;

    @NotNull(message = "얼굴 미인식 여부는 필수 항목입니다.")
    @Schema(description = "얼굴 미인식 여부", example = "false")
    private Boolean isFaceMissing;

    @Schema(description = "화면 밖 응시 여부", example = "false")
    private Boolean isGazeOutOfScreen;

    @Schema(description = "x 좌표", example = "1.1")
    private Float gazeX;

    @Schema(description = "y 좌표", example = "1.1")
    private Float gazeY;

    @Schema(description = "동공 크기", example = "3.1")
    private Float pupilSize;

    @Schema(description = "집중도", example = "1.0")
    private Float attentionRate;

    @Schema(description = "단어", example = "사과")
    private String word;

    @NotNull(message = "그림 여부는 필수 항목입니다.")
    @Schema(description = "그림 여부", example = "false")
    private Boolean isImage;
}
