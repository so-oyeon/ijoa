package com.checkitout.ijoa.quiz.dto.response;

import com.checkitout.ijoa.quiz.dto.request.ChatGPTResponse;
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

    public static QuizResponseDto of(Long quizId, String text) {
        return QuizResponseDto.builder()
                .quizId(quizId)
                .text(text)
                .build();
    }
}
