package com.checkitout.ijoa.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@Schema(description = "집중한 시간 그래프 요청")
public class FocusTimeRequest {

    @NotBlank(message = "주기는 필수 입력 값입니다.")
    @Pattern(regexp = "date|day|hour", message = "주기는 date, day, hour 중 하나여야 합니다.")
    @Schema(description = "주기", example = "day")
    private String interval;
}