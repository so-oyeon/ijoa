package com.checkitout.ijoa.quiz.docs;

import com.checkitout.ijoa.quiz.dto.request.AnswerRequestDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerResponseDto;
import com.checkitout.ijoa.quiz.dto.response.AnswerUrlResponseDto;
import com.checkitout.ijoa.quiz.dto.response.QuizResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "QuizManagement", description = "퀴즈 관리 관련 API")
public interface QuizApiDocumentation {

    @Operation(summary = "퀴즈 질문 조회", description = "페이지에 해당하는 질문입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "질문 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable Long pageId);


    @Operation(summary = "퀴즈 답변 저장", description = "답변을 저장할 수 있는 url을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "답변 저장 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<AnswerUrlResponseDto> getAnswerUrl(@RequestBody AnswerRequestDto requestDto);


    @Operation(summary = "특정 책 질문 답변 조회", description = "특정 책의 답변목록입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "답변 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public Page<AnswerResponseDto> getAnswerList(@PathVariable Long childrenId, @PathVariable Long fairytaleId, @RequestParam int page);

    @Operation(summary = "답변 삭제", description = "답변을 삭제할 수 있습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "답변 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public void deleteAnswer(@PathVariable Long answerId);

}
