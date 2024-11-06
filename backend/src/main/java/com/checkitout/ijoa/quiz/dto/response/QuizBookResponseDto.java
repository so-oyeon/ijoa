package com.checkitout.ijoa.quiz.dto.response;

import com.checkitout.ijoa.quiz.domain.QuizBook;
import com.checkitout.ijoa.quiz.dto.request.QuizBookRequestDto;
import lombok.Builder;
import lombok.Data;

@Data
public class QuizBookResponseDto {
    private Long book_id;
    private String image;

    @Builder
    public QuizBookResponseDto(Long book_id, String image) {
        this.book_id = book_id;
        this.image = image;
    }

    public static QuizBookResponseDto from(QuizBook quizBook) {
        return QuizBookResponseDto.builder()
                .book_id(quizBook.getFairytale().getId())
                .image(quizBook.getFairytale().getImageUrl())
                .build();
    }
}
