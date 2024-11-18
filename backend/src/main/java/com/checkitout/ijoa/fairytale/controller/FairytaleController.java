package com.checkitout.ijoa.fairytale.controller;


import com.checkitout.ijoa.fairytale.docs.FairytaleApiDocumentation;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.dto.FairytalePageViewResponse;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationRequest;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationResponse;
import com.checkitout.ijoa.fairytale.service.FairytaleService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fairytales")
@Validated
public class FairytaleController implements FairytaleApiDocumentation {
    private final FairytaleService fairytaleService;

    /**
     * 동화책 페이지 목록 조회
     *
     * @param fairytaleId 동화책 ID
     * @return 동화책 ID에 해당하는 모든 페이지 목록을 포함하는 ResponseEntity 객체를 반환합니다. 동화책 페이지 목록 조회에 실패하면 에러 코드를 담은 ResponseEntity를
     * 반환합니다.
     */
    @GetMapping("/{fairytaleId}/pages")
    public ResponseEntity<List<FairytalePageListResponse>> getFairytalePageList(
            @PathVariable Long fairytaleId) {

        List<FairytalePageListResponse> result = fairytaleService.getFairytalePageList(fairytaleId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    /**
     * 동화책 특정 페이지 조회
     *
     * @param fairytaleId 동화책 ID
     * @param pageNumber  페이지 번호
     * @return 동화책 ID의 페이지 번호에 해당하는 페이지 정보와 페이지 기록 ID를 포함하는 ResponseEntity 객체를 반환합니다. 동화책 특정 페이지 조회에 실패하면 에러 코드를 담은
     * ResponseEntity를 반환합니다.
     */
    @PostMapping("/{fairytaleId}/pages/{pageNumber}")
    public ResponseEntity<FairytalePageViewResponse> getFairytalePage(@PathVariable Long fairytaleId,
                                                                      @PathVariable Integer pageNumber) {
        FairytalePageViewResponse result = fairytaleService.getFairytalePage(fairytaleId, pageNumber);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * 동화책 특정 페이지 시선추적 데이터 저장
     *
     * @param pageHistoryId 페이지 기록 ID
     * @param request       trackedAt, isFaceMissing, isGazeOutOfScreen, gazeX, gazeY, pupilSize, attentionRate, word,
     *                      isImage
     * @return 입력받은 시선추적 데이터 정보를 포함하는 ResponseEntity 객체를 반환합니다. 동화책 특정 페이지 시선추적 데이터 저장에 실패하면 에러 코드를 담은 ResponseEntity를
     * 반환합니다.
     */
    @PostMapping("/reading-histories/{pageHistoryId}/eye-tracking")
    public ResponseEntity<PageHistoryCreationResponse> createPageHistory(
            @PathVariable Long pageHistoryId, @Valid @RequestBody PageHistoryCreationRequest request) {
        PageHistoryCreationResponse result = fairytaleService.createPageHistory(pageHistoryId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
