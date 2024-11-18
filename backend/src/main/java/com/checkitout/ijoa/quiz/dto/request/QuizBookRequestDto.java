package com.checkitout.ijoa.quiz.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuizBookRequestDto {

    @Schema(description = "시작 날짜", example = "2024-11-01T00:00:00")
    private String startDate;

    @Schema(description = "종료 날짜", example = "2024-11-30T23:59:59")
    private String  endDate;
}
