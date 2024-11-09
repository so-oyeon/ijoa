package com.checkitout.ijoa.fairytale.controller;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.fairytale.docs.FairytaleListApiDocumentation;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.service.FairytaleListService;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fairytales")
public class FairytaleListController implements FairytaleListApiDocumentation {

    private final FairytaleListService fairytaleListService;

    // Page로 만드는 함수 API 만들면 지워질 예정
    private List<FairytaleListResponseDto> makeList() {
        FairytaleListResponseDto fairytale = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .isCompleted(true)
                .currentPage(1)
                .totalPages(3)
                .build();

        List<FairytaleListResponseDto> fairytaleList = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            fairytaleList.add(fairytale);
        }

        return fairytaleList;
    }

    // 동화책 전체 목록
    @GetMapping("/list")
    public ResponseEntity<Page<FairytaleListResponseDto>> fairytaleListAll(
            @Valid @ModelAttribute PageRequestDto requestDto) {

        Page<FairytaleListResponseDto> response = fairytaleListService.getAllFairytale(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    //카테고리별 책 목록 조회
    @GetMapping("/list/{category}")
    public ResponseEntity<Page<FairytaleListResponseDto>> categoryFairytale(@PathVariable("category") CATEGORY category,
                                                                            @Valid @ModelAttribute PageRequestDto requestDto) {

        Page<FairytaleListResponseDto> response = fairytaleListService.getFairytalesByCategory(category, requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * 나이대 인기 도서 조회
     *
     * @return 아이의 나이대에서 많이 본 동화책 목록을 포함하는 ResponseEntity 객체를 반환합니다. 나이대 인기 도서 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @Override
    @GetMapping("/rank")
    public ResponseEntity<List<FairytaleListResponseDto>> getFairytaleRank() {
        List<FairytaleListResponseDto> fairytaleList = fairytaleListService.getFairytaleRank();

        HttpStatus status = fairytaleList.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;

        return new ResponseEntity<>(fairytaleList, status);
    }

    // Page로 만드는 함수 API 만들면 지워질 예정
    private List<FairytaleListResponseDto> makeReadFairytaleList() {
        FairytaleListResponseDto fairytale = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .isCompleted(true)
                .currentPage(5)
                .totalPages(5)
                .build();
        FairytaleListResponseDto fairytale1 = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .isCompleted(false)
                .currentPage(3)
                .totalPages(5)
                .build();
        FairytaleListResponseDto fairytale2 = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .isCompleted(true)
                .currentPage(5)
                .totalPages(5)
                .build();
        FairytaleListResponseDto fairytale3 = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .isCompleted(false)
                .currentPage(1)
                .totalPages(5)
                .build();

        List<FairytaleListResponseDto> fairytaleList = new ArrayList<>();

        fairytaleList.add(fairytale);
        fairytaleList.add(fairytale1);
        fairytaleList.add(fairytale2);
        fairytaleList.add(fairytale3);

        return fairytaleList;
    }

    // 읽은 책 목록 조회
    @Override
    @GetMapping("/children")
    public Page<FairytaleListResponseDto> readFairytaleList(@RequestParam("page") int page) {
        List<FairytaleListResponseDto> fairytaleList = makeReadFairytaleList();

        // 페이지 요청 객체 생성
        Pageable pageable = PageRequest.of(page, 8);

        // Page 객체 생성하여 반환
        return new PageImpl<>(fairytaleList, pageable, fairytaleList.size());
    }

    // 책 추천
    @Override
    @GetMapping("/recommendations")
    public ResponseEntity<List<FairytaleListResponseDto>> recommendFairytale() {
        List<FairytaleListResponseDto> fairytaleList = makeList();

        return new ResponseEntity<>(fairytaleList, HttpStatus.OK);
    }

    // 책검색
    @Override
    @GetMapping("/search")
    public Page<FairytaleListResponseDto> searchFairytale(@RequestParam("word") String word,
                                                          @RequestParam("page") int page) {
        List<FairytaleListResponseDto> fairytaleList = makeList();

        // 페이지 요청 객체 생성
        Pageable pageable = PageRequest.of(page, 8);

        // Page 객체 생성하여 반환
        return new PageImpl<>(fairytaleList, pageable, fairytaleList.size());
    }
}
