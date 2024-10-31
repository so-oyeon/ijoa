package com.checkitout.ijoa.fairytale.docs;

import com.checkitout.ijoa.common.dto.ResultResponseDto;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Fairytale", description = "동화책 관련 API")
public interface FairytaleApiDocumentation {

    @Operation(summary = "동화책 페이지 목록 조회", description = "동화책 ID에 해당하는 모든 페이지 목록을 조회합니다.\n동화책 ID에 해당하는 모든 페이지 목록을 포함하는 ResponseEntity 객체를 반환합니다. 동화책 페이지 목록 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "동화책의 전체 페이지 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 동화책 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<ResultResponseDto<List<FairytalePageListResponse>>> getFairytalePageList(
            @Schema(description = "동화책 ID", example = "1") @PathVariable Long fairytaleId);
}
