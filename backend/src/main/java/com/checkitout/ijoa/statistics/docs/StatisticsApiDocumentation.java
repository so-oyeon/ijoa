package com.checkitout.ijoa.statistics.docs;

import com.checkitout.ijoa.statistics.dto.CategoryStatisticsResponse;
import com.checkitout.ijoa.statistics.dto.FocusTimeRequest;
import com.checkitout.ijoa.statistics.dto.FocusTimeResponse;
import com.checkitout.ijoa.statistics.dto.ReadingReportResponse;
import com.checkitout.ijoa.statistics.dto.TypographyRequest;
import com.checkitout.ijoa.statistics.dto.TypographyResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Statistics", description = "통계 관련 API")
public interface StatisticsApiDocumentation {

    @Operation(summary = "집중한 시간 그래프 조회", description = "아이가 집중한 시간 그래프를 조회합니다.<br>주기에 맞는 집중한 시간 그래프 목록을 포함하는 ResponseEntity 객체를 반환합니다. 집중한 시간 그래프 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "동화책의 전체 페이지 목록 조회 성공"),
            @ApiResponse(responseCode = "204", description = "동화책의 전체 페이지 목록 조회 성공 - 시선추적 데이터가 없는 경우", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 입력", content = @Content),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "403", description = "부모 ID와 연결되지 않은 아이 ID", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 부모 ID / 존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<List<FocusTimeResponse>> getFocusTime(
            @Schema(description = "아이 ID", example = "1") @PathVariable Long childId,
            @Valid @ModelAttribute FocusTimeRequest request);

    @Operation(summary = "독서 분석 보고서 조회", description = "아이의 독서 활동을 종합적으로 분석한 보고서를 제공합니다. 독서 습관과 관련된 통계를 포함합니다.<br>독서 분석 보고서를 포함하는 ResponseEntity 객체를 반환합니다. 독서 분석 보고서 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "독서 분석 보고서 조회 성공"),
            @ApiResponse(responseCode = "204", description = "독서 분석 보고서 조회 성공 - 독서 기록이 없는 경우", content = @Content),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "403", description = "부모 ID와 연결되지 않은 아이 ID", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<ReadingReportResponse> getReadingReport(
            @Schema(description = "아이 ID", example = "1") @PathVariable Long childId);

    @Operation(summary = "집중한 단어 타이포그래피 조회", description = "아이가 집중한 단어들의 타이포그래피를 조회합니다.<br>count 수 만틈 집중한 단어들의 정보 목록을 포함하는 ResponseEntity 객체를 반환합니다. 집중한 단어 타이포그래피 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "집중한 단어 타이포그래피 조회 성공"),
            @ApiResponse(responseCode = "204", description = "집중한 단어 타이포그래피 조회 성공 - 시선추적 데이터가 없는 경우", content = @Content),
            @ApiResponse(responseCode = "400", description = "잘못된 입력", content = @Content),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "403", description = "부모 ID와 연결되지 않은 아이 ID", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 부모 ID / 존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<List<TypographyResponse>> getTypography(
            @Schema(description = "아이 ID", example = "1") @PathVariable Long childId,
            @Valid @ModelAttribute TypographyRequest request);

    @Operation(summary = "분류별 독서 통계 조회", description = "아이가 읽은 책들의 분류별 통계를 조회합니다.<br>각 분류별로 읽은 책의 개수를 포함하는 ResponseEntity 객체를 반환합니다. 분류별 독서 통계 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "분류별 독서 통계 조회 성공"),
            @ApiResponse(responseCode = "204", description = "분류별 독서 통계 조회 성공 - 독서 기록이 없는 경우", content = @Content),
            @ApiResponse(responseCode = "401", description = "로그인 안함", content = @Content),
            @ApiResponse(responseCode = "403", description = "부모 ID와 연결되지 않은 아이 ID", content = @Content),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 부모 ID / 존재하지 않는 아이 ID", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content)
    })
    public ResponseEntity<List<CategoryStatisticsResponse>> getCategoryStatistics(
            @Schema(description = "아이 ID", example = "1") @PathVariable Long childId);
}
