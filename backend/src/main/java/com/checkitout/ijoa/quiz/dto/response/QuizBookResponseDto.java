package com.checkitout.ijoa.quiz.dto.response;

import com.checkitout.ijoa.quiz.domain.QuizBook;
import com.checkitout.ijoa.quiz.dto.request.QuizBookRequestDto;
import lombok.Builder;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class QuizBookResponseDto {
    private Long book_id;
    private String title;
    private String image;
    private String date;


    @Builder
    public QuizBookResponseDto(Long book_id, String image,String title,String date) {
        this.book_id = book_id;
        this.image = image;
        this.title = title;
        this.date = date;
    }

    public static QuizBookResponseDto from(QuizBook quizBook) {
        // LocalDateTime -> String (yyyy-MM-dd)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = quizBook.getUpdatedAt().toLocalDate().format(formatter);

        return QuizBookResponseDto.builder()
                .book_id(quizBook.getFairytale().getId())
                .title(quizBook.getFairytale().getTitle())
                .image(quizBook.getFairytale().getImageUrl())
                .date(formattedDate)
                .build();
    }
}
