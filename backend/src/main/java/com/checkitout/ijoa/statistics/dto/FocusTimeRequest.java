package com.checkitout.ijoa.statistics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
@Schema(description = "집중한 시간 그래프 요청")
public class FocusTimeRequest {

    @NotBlank(message = "기간은 필수 입력 값입니다.")
    @Pattern(regexp = "daily|weekly|monthly|yearly", message = "기간은 daily, weekly, monthly, yearly 중 하나여야 합니다.")
    @Schema(description = "기간", example = "weekly")
    private String period;

    @NotNull(message = "시작 날짜는 필수 입력 값입니다.")
    @PastOrPresent(message = "시작 날짜는 현재 또는 과거 날짜여야 합니다.")
    @Schema(description = "시작 날짜", example = "2024-10-25")
    private LocalDate startDate;
}