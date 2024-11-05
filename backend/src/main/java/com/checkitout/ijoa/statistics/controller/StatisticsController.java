package com.checkitout.ijoa.statistics.controller;

import com.checkitout.ijoa.statistics.docs.StatisticsApiDocumentation;
import com.checkitout.ijoa.statistics.dto.CategoryStatisticsResponse;
import com.checkitout.ijoa.statistics.dto.FocusTimeRequest;
import com.checkitout.ijoa.statistics.dto.FocusTimeResponse;
import com.checkitout.ijoa.statistics.dto.ReadingReportResponse;
import com.checkitout.ijoa.statistics.dto.TypographyRequest;
import com.checkitout.ijoa.statistics.dto.TypographyResponse;
import com.checkitout.ijoa.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/children/{childId}/statistics")
public class StatisticsController implements StatisticsApiDocumentation {
    private final StatisticsService statisticsService;

    /**
     * 집중한 시간 그래프 조회
     *
     * @param childId 아이 ID
     * @param request interval
     * @return 주기에 맞는 집중한 시간 그래프 목록을 포함하는 ResponseEntity 객체를 반환합니다. 집중한 시간 그래프 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @GetMapping("/focus-time")
    public ResponseEntity<List<FocusTimeResponse>> getFocusTime(@PathVariable Long childId,
                                                                @Valid @ModelAttribute FocusTimeRequest request) {
        List<FocusTimeResponse> result = statisticsService.getFocusTime(childId, request.getInterval());

        HttpStatus status = result.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;

        return ResponseEntity.status(status).body(result);
    }

    /**
     * 독서 분석 보고서 조회
     *
     * @param childId 아이 ID
     * @return 독서 분석 보고서를 포함하는 ResponseEntity 객체를 반환합니다. 독서 분석 보고서 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @GetMapping("/reading-report")
    public ResponseEntity<ReadingReportResponse> getReadingReport(@PathVariable Long childId) {
        ReadingReportResponse result = statisticsService.getReadingReport(childId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    /**
     * 집중한 단어 타이포그래피 조회
     *
     * @param childId 아이 ID
     * @param request count
     * @return count 수 만틈 집중한 단어들의 정보 목록을 포함하는 ResponseEntity 객체를 반환합니다. 집중한 단어 타이포그래피 조회에 실패하면 에러 코드를 담은
     * ResponseEntity를 반환합니다.
     */
    @GetMapping("/typography")
    public ResponseEntity<List<TypographyResponse>> getTypography(
            @Schema(description = "아이 ID", example = "1") @PathVariable Long childId,
            @Valid @ModelAttribute TypographyRequest request) {
        List<TypographyResponse> result = statisticsService.getTypography(childId, request.getCount());

        HttpStatus status = result.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;

        return ResponseEntity.status(status).body(result);
    }

    /**
     * 분류별 독서 통계 조회
     *
     * @param childId 아이 ID
     * @return 각 분류별로 읽은 책의 개수를 포함하는 ResponseEntity 객체를 반환합니다. 분류별 독서 통계 조회에 실패하면 에러 코드를 담은 ResponseEntity를 반환합니다.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryStatisticsResponse>> getCategoryStatistics(@PathVariable Long childId) {
        List<CategoryStatisticsResponse> result = statisticsService.getCategoryStatistics(childId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
