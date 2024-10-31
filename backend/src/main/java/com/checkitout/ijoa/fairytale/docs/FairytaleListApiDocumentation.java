package com.checkitout.ijoa.fairytale.docs;

import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@Tag(name = "Fairytale", description = "동화책 관련 API")
public interface FairytaleListApiDocumentation {

    @Operation(summary = "동화책 전체 목록 조회", description = "모든 동화책 목록을 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public Page<FairytaleListResponseDto> fairytaleListAll(@RequestParam int page);

    @Operation(summary = "카테고리별 도서 목록 조회", description = "해당 카테고리별 도서 목록을 조회 할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public Page<FairytaleListResponseDto> categoryFairytale(@PathVariable("categoryId") int categoryId, @RequestParam("page")int page);

    @Operation(summary = "나이별 인기도서 ", description = "나이별 인기 도서 순위를 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<FairytaleListResponseDto>> fairytaleRankAge(@PathVariable("age")int age);

    @Operation(summary = "읽은 책과 읽고있는 책 목록 조회", description = "아이가 읽은 책과 읽고있는 책의 목록을 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public Page<FairytaleListResponseDto> readFairytaleList(@RequestParam("page") int page);

    @Operation(summary = "사용자 맞춤 책 추천 ", description = "아이 맞춤 책 추천 목록을 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<FairytaleListResponseDto>> recommendFairytale();

    @Operation(summary = "도서 검색 ", description = "키워드로 제목 검색을 할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public Page<FairytaleListResponseDto> searchFairytale(@RequestParam("word")String word,@RequestParam("page")int page);

}
