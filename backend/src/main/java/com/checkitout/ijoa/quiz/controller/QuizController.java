package com.checkitout.ijoa.quiz.controller;

import com.checkitout.ijoa.quiz.docs.QuizApiDocumentation;
import com.checkitout.ijoa.quiz.dto.request.AnswerRequestDto;
import com.checkitout.ijoa.quiz.dto.request.QuizBookRequestDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerResponseDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerUrlResponseDto;
import com.checkitout.ijoa.quiz.dto.response.QuizBookResponseDto;
import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import com.checkitout.ijoa.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/quiz")
public class QuizController implements QuizApiDocumentation {

    private final QuizService quizService;

    // 질문 조회
    @Override
    @GetMapping("/question/{bookId}/{pageNum}")
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable("bookId") Long bookId, @PathVariable("pageNum") Integer pageNum) {
        QuizResponseDto responseDto = quizService.fairytaleQuiz(bookId, pageNum);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    //답변 url생성
    @Override
    @PostMapping("/answer")
    public ResponseEntity<AnswerUrlResponseDto> getAnswerUrl(AnswerRequestDto requestDto) {
        AnswerUrlResponseDto responseDto = quizService.getAnswerUrl(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Override
    @PostMapping("/answer/list/{childId}")
    public Page<QuizBookResponseDto> getQuizBookList(@PathVariable("childId") Long childId,@RequestParam("page") int page, @RequestBody QuizBookRequestDto requestDto ) {
        Pageable pageable = PageRequest.of(page-1, 8);

        return quizService.getQuizBookList(requestDto, childId,pageable);
    }

    // 책 답변 목록
    @Override
    @GetMapping("/answer/{childrenId}/{fairytaleId}")
    public ResponseEntity<?> getAnswerList(@PathVariable("childrenId") Long childrenId, @PathVariable("fairytaleId") Long fairytaleId ) {
        List<AnswerResponseDto> responseDtos =  quizService.getAnswerList(childrenId,fairytaleId);
        // Page 객체 생성하여 반환
        return new ResponseEntity<>(responseDtos, HttpStatus.OK);
    }

    @Override
    @DeleteMapping("/answer/{answerId}")
    public void deleteAnswer(@PathVariable("answerId") Long answerId) {

    }

}
