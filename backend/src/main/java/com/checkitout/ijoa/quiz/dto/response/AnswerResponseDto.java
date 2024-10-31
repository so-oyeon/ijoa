package com.checkitout.ijoa.quiz.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class AnswerResponseDto {
    private Long answerId;
    private Long fairytaleId;
    private Long quizId;
    private String text;
    private String image;
    private String answer;

    @Builder
    public AnswerResponseDto(Long answerId, Long fairytaleId, Long quizId, String text, String image, String answer) {
        this.answerId = answerId;
        this.fairytaleId = fairytaleId;
        this.quizId = quizId;
        this.text = text;
        this.image = image;
        this.answer = answer;
    }
}
