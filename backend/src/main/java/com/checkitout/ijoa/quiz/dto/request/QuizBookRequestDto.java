package com.checkitout.ijoa.quiz.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class QuizBookRequestDto {

    @Schema(description = "시작 날짜", example = "2024-10-01")
    private String startDate;

    @Schema(description = "종료 날짜", example = "2024-11-06")
    private String endDate;
}
