package com.checkitout.ijoa.quiz.controller;

import com.checkitout.ijoa.quiz.docs.QuizApiDocumentation;
import com.checkitout.ijoa.quiz.dto.request.AnswerRequestDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerResponseDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerUrlResponseDto;
import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import com.checkitout.ijoa.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    @GetMapping("/question/{pageId}")
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable Long pageId) {
        QuizResponseDto responseDto = quizService.fairytaleQuiz(pageId);
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

    private List<AnswerResponseDto> makeList(){
        List<AnswerResponseDto> list = new ArrayList<>();
        AnswerResponseDto responseDto = AnswerResponseDto.builder()
                .answerId(313232L)
                .quizId(231312L)
                .answerId(12313213L)
                .text("질문질문")
                .image("image urlurl")
                .fairytaleId(13132L)
                .answer("answer url")
                .build();

        for(int i =0;i<10;i++){
            list.add(responseDto);
        }
        return list;

    }

    // 책 답변 목록
    @Override
    @GetMapping("/answer/{childrenId}/{fairytaleId}")
    public Page<AnswerResponseDto> getAnswerList(Long childrenId, Long fairytaleId, int page) {

        List<AnswerResponseDto> answerList = makeList();

        // 페이지 요청 객체 생성
        Pageable pageable = PageRequest.of(page, 3);

        // Page 객체 생성하여 반환
        return new PageImpl<>(answerList, pageable, answerList.size());
    }

    @Override
    @DeleteMapping("/answer/{answerId}")
    public void deleteAnswer(@PathVariable("answerId") Long answerId) {

    }

}
