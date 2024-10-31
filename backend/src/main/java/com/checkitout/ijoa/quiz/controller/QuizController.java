package com.checkitout.ijoa.quiz.controller;

import com.checkitout.ijoa.quiz.docs.QuizApiDocumentation;
import com.checkitout.ijoa.quiz.dto.request.AnswerRequestDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerResponseDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerUrlResponseDto;
import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/quiz")
public class QuizController implements QuizApiDocumentation {

    // 질문 조회
    @Override
    @GetMapping("/question/{pageId}")
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable Long pageId) {
        QuizResponseDto responseDto = QuizResponseDto.builder()
                .quizId(123412L)
                .text("질문질문")
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    //답변 url생성
    @Override
    @PostMapping("/answer")
    public ResponseEntity<AnswerUrlResponseDto> getAnswerUrl(AnswerRequestDto requestDto) {
        AnswerUrlResponseDto responseDto = AnswerUrlResponseDto.builder()
                .answerId(313232L)
                .answerUrl("urlurlrurl")
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
