package com.checkitout.ijoa.fairytale.controller;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.fairytale.docs.FairytaleListApiDocumentation;
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
                .is_completed(true)
                .current_page(1)
                .total_pages(3)
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
    @Override
    @GetMapping("/list/{categoryId}")
    public Page<FairytaleListResponseDto> categoryFairytale(@PathVariable("categoryId") int categoryId,
                                                            @RequestParam("page") int page) {
        List<FairytaleListResponseDto> fairytaleList = makeList();

        // 페이지 요청 객체 생성
        Pageable pageable = PageRequest.of(page, 8);

        // Page 객체 생성하여 반환
        return new PageImpl<>(fairytaleList, pageable, fairytaleList.size());
    }

    // 나이대별 인기도서
    @Override
    @GetMapping("/rank/{age}")
    public ResponseEntity<List<FairytaleListResponseDto>> fairytaleRankAge(@PathVariable("age") int age) {
        List<FairytaleListResponseDto> fairytaleList = makeList();

        return new ResponseEntity<>(fairytaleList, HttpStatus.OK);
    }
    // Page로 만드는 함수 API 만들면 지워질 예정
    private List<FairytaleListResponseDto> makeReadFairytaleList(){
        FairytaleListResponseDto fairytale = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(true)
                .current_page(5)
                .total_pages(5)
                .build();
        FairytaleListResponseDto fairytale1 = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(false)
                .current_page(3)
                .total_pages(5)
                .build();
        FairytaleListResponseDto fairytale2 = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(true)
                .current_page(5)
                .total_pages(5)
                .build();
        FairytaleListResponseDto fairytale3 = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(false)
                .current_page(1)
                .total_pages(5)
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
    public Page<FairytaleListResponseDto> readFairytaleList( @RequestParam("page") int page) {
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
