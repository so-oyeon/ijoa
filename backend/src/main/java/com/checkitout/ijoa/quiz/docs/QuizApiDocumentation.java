package com.checkitout.ijoa.quiz.docs;

import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "QuizManagement", description = "퀴즈 관리 관련 API")
public interface QuizApiDocumentation {

    @Operation(summary = "퀴즈 질문 조회", description = "페이지에 해당하는 질문입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "질문 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable Long pageId);



}
