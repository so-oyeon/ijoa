package com.checkitout.ijoa.quiz.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
public class AnswerUrlResponseDto {
    private Long answerId;
    private String answerUrl;

    @Builder
    public AnswerUrlResponseDto(Long answerId, String answerUrl) {
        this.answerId = answerId;
        this.answerUrl = answerUrl;
    }
}
