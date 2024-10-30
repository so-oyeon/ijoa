package com.checkitout.ijoa.fairytale.controller;

import com.checkitout.ijoa.fairytale.docs.FairytaleListApiDocumentation;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fairytales")
public class FairytaleListController implements FairytaleListApiDocumentation {

    private Page<FairytaleListResponseDto> makePage(int page){
        FairytaleListResponseDto fairytale = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(true)
                .current_page(1)
                .total_pages(3)
                .build();

        // 단일 항목 리스트로 생성 (필요 시 여러 항목 추가 가능)
        List<FairytaleListResponseDto> fairytaleList = Collections.singletonList(fairytale);

        for(int i=0;i<8;i++){
            fairytaleList.add(fairytale);
        }

        // 페이지 요청 객체 생성
        Pageable pageable = PageRequest.of(page, 8);

        // Page 객체 생성하여 반환
        return new PageImpl<>(fairytaleList, pageable, fairytaleList.size());
    }

    @Override
    public Page<FairytaleListResponseDto> fairytaleListAll(int page) {

        return makePage(page);
    }

    @Override
    public Page<FairytaleListResponseDto> categoryFairytale(int categoryId, int page) {
        return makePage(page);
    }

    @Override
    public ResponseEntity<List<FairytaleListResponseDto>> fairytaleRankAge(int age) {
        FairytaleListResponseDto fairytale = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(true)
                .current_page(1)
                .total_pages(3)
                .build();

        // 단일 항목 리스트로 생성 (필요 시 여러 항목 추가 가능)
        List<FairytaleListResponseDto> fairytaleList = Collections.singletonList(fairytale);

        for(int i=0;i<10;i++){
            fairytaleList.add(fairytale);
        }
        return new ResponseEntity<>(fairytaleList, HttpStatus.OK);
    }

    @Override
    public Page<FairytaleListResponseDto> readFairytaleList(int childrenId, int page) {

        return makePage(page);
    }

    @Override
    public ResponseEntity<List<FairytaleListResponseDto>> recommendFairytale(Long childrenId) {
        FairytaleListResponseDto fairytale = FairytaleListResponseDto.builder()
                .fairytaleId(1)
                .image("url")
                .title("제목")
                .is_completed(true)
                .current_page(1)
                .total_pages(3)
                .build();

        // 단일 항목 리스트로 생성 (필요 시 여러 항목 추가 가능)
        List<FairytaleListResponseDto> fairytaleList = Collections.singletonList(fairytale);

        for(int i=0;i<10;i++){
            fairytaleList.add(fairytale);
        }
        return new ResponseEntity<>(fairytaleList, HttpStatus.OK);
    }

    @Override
    public Page<FairytaleListResponseDto> searchFairytale(String word, int page) {
        return makePage(page);
    }
}
