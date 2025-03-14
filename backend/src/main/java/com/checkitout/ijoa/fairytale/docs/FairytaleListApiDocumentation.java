package com.checkitout.ijoa.fairytale.docs;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Fairytale", description = "동화책 관련 API")
public interface FairytaleListApiDocumentation {

    @Operation(summary = "동화책 전체 목록 조회", description = "모든 동화책 목록을 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(array = @ArraySchema(schema = @Schema(implementation = FairytaleListResponseDto.class)))),
            @ApiResponse(responseCode = "204", description = "동화책 없음", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<Page<FairytaleListResponseDto>> fairytaleListAll(
            @Valid @ModelAttribute PageRequestDto requestDto);

    @Operation(summary = "카테고리별 도서 목록 조회", description = "해당 카테고리별 도서 목록을 조회 할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(array = @ArraySchema(schema = @Schema(implementation = FairytaleListResponseDto.class)))),
            @ApiResponse(responseCode = "204", description = "동화책 없음", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<Page<FairytaleListResponseDto>> categoryFairytale(@PathVariable("category") CATEGORY category,
                                                                            @Valid @ModelAttribute PageRequestDto requestDto);

    @Operation(summary = "나이대 인기 도서 조회", description = "아이 나이대 인기 도서 순위를 조회할 수 있습니다.\n아이의 나이대에서 많이 본 동화책 목록을 포함하는 ResponseEntity 객체를 반환합니다. 나이대 인기 도서 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "나이대 인기 도서 조회 성공"),
            @ApiResponse(responseCode = "204", description = "나이대 인기 도서 조회 성공 - 동화책 데이터가 없는 경우", content = @Content),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<List<FairytaleListResponseDto>> getFairytaleRank();

    @Operation(summary = "읽은 책과 읽고있는 책 목록 조회", description = "아이가 읽은 책과 읽고있는 책의 목록을 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(array = @ArraySchema(schema = @Schema(implementation = FairytaleListResponseDto.class)))),
            @ApiResponse(responseCode = "204", description = "동화책 없음", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<Page<FairytaleListResponseDto>> readFairytaleList(
            @Valid @ModelAttribute PageRequestDto requestDto);

    @Operation(summary = "사용자 맞춤 책 추천 ", description = "아이 맞춤 책 추천 목록을 조회할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(array = @ArraySchema(schema = @Schema(implementation = FairytaleListResponseDto.class)))),
            @ApiResponse(responseCode = "204", description = "동화책 없음", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<Page<FairytaleListResponseDto>> recommendFairytale();

    @Operation(summary = "도서 검색 ", description = "키워드로 제목 검색을 할 수 있습니다. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(array = @ArraySchema(schema = @Schema(implementation = FairytaleListResponseDto.class)))),
            @ApiResponse(responseCode = "204", description = "동화책 없음", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<Page<FairytaleListResponseDto>> searchFairytale(@RequestParam String title,
                                                                          @Valid @ModelAttribute PageRequestDto requestDto);

}
