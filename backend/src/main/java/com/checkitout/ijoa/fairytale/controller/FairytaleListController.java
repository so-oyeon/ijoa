package com.checkitout.ijoa.fairytale.controller;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.fairytale.docs.FairytaleListApiDocumentation;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.service.FairytaleListService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    @GetMapping("/rank")
    public ResponseEntity<List<FairytaleListResponseDto>> getFairytaleRank() {
        List<FairytaleListResponseDto> fairytaleList = fairytaleListService.getFairytaleRank();

        HttpStatus status = fairytaleList.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;

        return new ResponseEntity<>(fairytaleList, status);
    }

    // 읽은 책 목록 조회
    @GetMapping("/children")
    public ResponseEntity<Page<FairytaleListResponseDto>> readFairytaleList(
            @Valid @ModelAttribute PageRequestDto requestDto) {

        Page<FairytaleListResponseDto> response = fairytaleListService.readFairytaleList(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 책 추천
    @GetMapping("/recommendations")
    public ResponseEntity<Page<FairytaleListResponseDto>> recommendFairytale() {

        Page<FairytaleListResponseDto> response = fairytaleListService.recommendFairytaleList();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 책검색
    @GetMapping("/search")
    public ResponseEntity<Page<FairytaleListResponseDto>> searchFairytale(@RequestParam String title,
                                                                          @Valid @ModelAttribute PageRequestDto requestDto) {
        Page<FairytaleListResponseDto> response = fairytaleListService.searchFairytaleList(title, requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
