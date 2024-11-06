package com.checkitout.ijoa.quiz.dto.response;

import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.quiz.domain.Answer;
import com.checkitout.ijoa.quiz.domain.Quiz;
import lombok.Builder;
import lombok.Data;
import org.aspectj.weaver.patterns.TypePatternQuestions;

@Data
public class AnswerResponseDto {
    private Long answerId;
    private Long fairytaleId;
    private Long quizId;
    private String questionText;
    private String image;
    private String answer;

    @Builder
    public AnswerResponseDto(Long answerId, Long fairytaleId, Long quizId, String questionText, String image, String answer) {
        this.answerId = answerId;
        this.fairytaleId = fairytaleId;
        this.quizId = quizId;
        this.questionText = questionText;
        this.image = image;
        this.answer = answer;
    }

    public static AnswerResponseDto from(Answer answer, Fairytale fairytale,String answerurl) {
        return AnswerResponseDto.builder()
                .answerId(answer.getId())
                .fairytaleId(fairytale.getId())
                .quizId(answer.getQuiz().getId())
                .questionText(answer.getQuiz().getQuestion())
                .image(answer.getQuiz().getPage().getFairytalePageImage().getImageUrl())
                .answer(answerurl)
                .build();
    }

}
