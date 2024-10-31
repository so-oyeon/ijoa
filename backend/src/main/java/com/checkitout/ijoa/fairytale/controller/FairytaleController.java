package com.checkitout.ijoa.fairytale.controller;


import com.checkitout.ijoa.common.dto.ResultResponseDto;
import com.checkitout.ijoa.fairytale.docs.FairytaleApiDocumentation;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.service.FairytaleService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<ResultResponseDto<List<FairytalePageListResponse>>> getFairytalePageList(
            @PathVariable Long fairytaleId) {

        List<FairytalePageListResponse> result = fairytaleService.getFairytalePageList(fairytaleId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultResponseDto.from(result));
    }
}
