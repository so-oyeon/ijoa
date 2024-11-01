package com.checkitout.ijoa.fairytale.service;

import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_PAGE_NOT_FOUND;
import static java.time.LocalDateTime.now;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.dto.FairytalePageViewResponse;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationRequest;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationResponse;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.fairytale.repository.PageHistoryRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FairytaleService {
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;
    private final PageHistoryRepository pageHistoryRepository;
    private final SecurityUtil securityUtil;

    /**
     * 동화책 페이지 목록 조회
     */
    @Transactional(readOnly = true)
    public List<FairytalePageListResponse> getFairytalePageList(Long fairytaleId) {
        Fairytale fairytale = getFairytaleById(fairytaleId);

        return convertToFairytalePageListResponse(fairytale);
    }

    /**
     * 동화책 특정 페이지 조회
     */
    public FairytalePageViewResponse getFairytalePage(Long fairytaleId, Integer pageNumber) {
        Fairytale fairytale = getFairytaleById(fairytaleId);
        FairytalePageContent fairytalePageContent = getFairytalePageContent(fairytale, pageNumber);
        Child child = securityUtil.getChildByToken();

        PageHistory pageHistory = pageHistoryRepository.save(PageHistory.of(now(), child, fairytalePageContent));

        return FairytalePageViewResponse.of(fairytalePageContent, pageHistory);
    }

    public PageHistoryCreationResponse createPageHistory(Long fairytaleId, PageHistoryCreationRequest request) {
        Fairytale fairytale = getFairytaleById(fairytaleId);

//        securityUtil.getUserByToken();

        return PageHistoryCreationResponse.test();
    }

    /**
     * 동화책 조회
     */
    private Fairytale getFairytaleById(Long fairytaleId) {
        return fairytaleRepository.findById(fairytaleId)
                .orElseThrow(() -> new CustomException(FAIRYTALE_NOT_FOUND));
    }

    private List<FairytalePageListResponse> convertToFairytalePageListResponse(Fairytale fairytale) {
        return fairytale.getFairytalePageImages().stream()
                .map(FairytalePageListResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 동화책 페이지 내용 조회
     */
    private FairytalePageContent getFairytalePageContent(Fairytale fairytale, Integer pageNumber) {
        return fairytalePageContentRepository.findByFairytaleAndPageNumber(fairytale, pageNumber)
                .orElseThrow(() -> new CustomException(FAIRYTALE_PAGE_NOT_FOUND));
    }
}
