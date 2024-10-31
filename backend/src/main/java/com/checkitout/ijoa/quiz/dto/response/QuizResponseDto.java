package com.checkitout.ijoa.quiz.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class QuizResponseDto {
    private Long quizId;
    private String text;

    @Builder
    public QuizResponseDto(Long quizId, String text) {
        this.quizId = quizId;
        this.text = text;
    }
}
