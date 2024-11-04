package com.checkitout.ijoa.fairytale.docs;

import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.dto.FairytalePageViewResponse;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationRequest;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Fairytale", description = "동화책 관련 API")
public interface FairytaleApiDocumentation {

    @Operation(summary = "동화책 페이지 목록 조회", description = "동화책 ID에 해당하는 모든 페이지 목록을 조회합니다.\n동화책 ID에 해당하는 모든 페이지 목록을 포함하는 ResponseEntity 객체를 반환합니다. 동화책 페이지 목록 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "동화책의 전체 페이지 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 동화책 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<List<FairytalePageListResponse>> getFairytalePageList(
            @Schema(description = "동화책 ID", example = "1") @PathVariable Long fairytaleId);

    @Operation(summary = "동화책 특정 페이지 조회", description = "동화책의 특정 페이지 내용 조회합니다.\n동화책 ID의 페이지 번호에 해당하는 페이지 정보를 포함하는 ResponseEntity 객체를 반환합니다. 동화책 특정 페이지 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "동화책 특정 페이지 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 동화책 ID / 존재하지 않는 동화책 페이지 / 존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<FairytalePageViewResponse> getFairytalePage(
            @Schema(description = "동화책 ID", example = "1") @PathVariable Long fairytaleId,
            @Schema(description = "동화책 페이지 번호", example = "1") @PathVariable Integer pageNumber);

    @Operation(summary = "동화책 특정 페이지 시선추적 데이터 저장", description = "아이가 동화책을 읽는 동안 해당 페이지에 대한 시선추적 데이터를 저장합니다.\n입력받은 시선추적 데이터 정보를 포함하는 ResponseEntity 객체를 반환합니다. 동화책 특정 페이지 시선추적 데이터 저장에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "동화책 특정 페이지 시선추적 데이터 저장 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 입력", content = @Content),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "403", description = "페이지 기록 ID와 연결되지 않은 아이 ID", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 페이지 기록 ID / 존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<PageHistoryCreationResponse> createPageHistory(
            @Schema(description = "페이지 기록 ID", example = "1") @PathVariable Long pageHistoryId,
            @Valid @RequestBody PageHistoryCreationRequest request);
}
