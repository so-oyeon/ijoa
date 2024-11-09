package com.checkitout.ijoa.fairytale.service;

import static com.checkitout.ijoa.exception.ErrorCode.CHILD_READ_BOOK_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_PAGE_NOT_FOUND;
import static com.checkitout.ijoa.exception.ErrorCode.PAGE_HISTORY_ACCESS_DENIED;
import static com.checkitout.ijoa.exception.ErrorCode.PAGE_HISTORY_NOT_FOUND;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.EyeTrackingData;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.FairytalePageContent;
import com.checkitout.ijoa.fairytale.domain.PageHistory;
import com.checkitout.ijoa.fairytale.domain.redis.RedisReadBook;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.dto.FairytalePageViewResponse;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationRequest;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationResponse;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.EyeTrackingDataRepository;
import com.checkitout.ijoa.fairytale.repository.FairytalePageContentRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.fairytale.repository.PageHistoryRepository;
import com.checkitout.ijoa.fairytale.repository.redis.RedisReadBookRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FairytaleService {
    private final FairytaleRepository fairytaleRepository;
    private final FairytalePageContentRepository fairytalePageContentRepository;
    private final PageHistoryRepository pageHistoryRepository;
    private final EyeTrackingDataRepository eyeTrackingDataRepository;
    private final ChildReadBooksRepository childReadBooksRepository;
    private final RedisReadBookRepository redisReadBookRepository;
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
     * 동화책 특정 페이지 조회 및 읽기 진행상태 업데이트
     */
    @Transactional
    public FairytalePageViewResponse getFairytalePage(Long fairytaleId, Integer pageNumber) {
        Fairytale fairytale = getFairytaleById(fairytaleId);
        FairytalePageContent fairytalePageContent = getFairytalePageContent(fairytale, pageNumber);
        Child child = securityUtil.getChildByToken();

        PageHistory pageHistory = pageHistoryRepository.save(PageHistory.of(child, fairytalePageContent));

        ChildReadBooks readBook = processReadingProgress(child, fairytale, pageNumber);

        redisReadBookRepository.save(
                new RedisReadBook(fairytaleId, child.getId(), pageNumber, readBook.getIsCompleted()));

        return FairytalePageViewResponse.of(fairytalePageContent, pageHistory);
    }

    /**
     * 동화책 특정 페이지 시선추적 데이터 저장
     */
    @Transactional
    public PageHistoryCreationResponse createPageHistory(Long pageHistoryId, PageHistoryCreationRequest request) {
        PageHistory pageHistory = getPageHistoryById(pageHistoryId);
        Child child = securityUtil.getChildByToken();

        validatePageHistoryAccess(pageHistory, child);

        EyeTrackingData eyeTrackingData = eyeTrackingDataRepository.save(request.toEntity(pageHistory));

        return PageHistoryCreationResponse.from(eyeTrackingData);
    }


    // 동화책 조회
    private Fairytale getFairytaleById(Long fairytaleId) {
        return fairytaleRepository.findById(fairytaleId)
                .orElseThrow(() -> new CustomException(FAIRYTALE_NOT_FOUND));
    }

    // 동화책 페이지 목록 DTO 변환
    private List<FairytalePageListResponse> convertToFairytalePageListResponse(Fairytale fairytale) {
        return fairytale.getFairytalePageImages().stream()
                .map(FairytalePageListResponse::from)
                .toList();
    }

    // 동화책 페이지 내용 조회
    private FairytalePageContent getFairytalePageContent(Fairytale fairytale, Integer pageNumber) {
        return fairytalePageContentRepository.findByFairytaleAndPageNumber(fairytale, pageNumber)
                .orElseThrow(() -> new CustomException(FAIRYTALE_PAGE_NOT_FOUND));
    }

    // 페이지 기록 조회
    private PageHistory getPageHistoryById(Long pageHistoryId) {
        return pageHistoryRepository.findById(pageHistoryId)
                .orElseThrow(() -> new CustomException(PAGE_HISTORY_NOT_FOUND));
    }

    // 페이지 기록 접근 권한 검증
    private void validatePageHistoryAccess(PageHistory pageHistory, Child child) {
        if (!Objects.equals(pageHistory.getChild().getId(), child.getId())) {
            throw new CustomException(PAGE_HISTORY_ACCESS_DENIED);
        }
    }

    // 읽기 진행상태 처리
    private ChildReadBooks processReadingProgress(Child child, Fairytale fairytale, Integer pageNumber) {
        ChildReadBooks readBook;

        if (pageNumber == 1) {
            readBook = getOrCreateReadBook(child, fairytale, pageNumber);
        } else {
            readBook = findReadBook(child.getId(), fairytale.getId());
        }

        if (pageNumber.equals(fairytale.getTotalPages())) {
            readBook.completeReading();
        }

        return readBook;
    }

    private ChildReadBooks getOrCreateReadBook(Child child, Fairytale fairytale, Integer currentPage) {
        return childReadBooksRepository.findByChildIdAndFairytaleId(child.getId(), fairytale.getId())
                .orElseGet(() -> {
                    ChildReadBooks newReadBook = ChildReadBooks.of(currentPage, null, false, child, fairytale, 0);
                    return childReadBooksRepository.save(newReadBook);
                });
    }

    // 읽은 책 조회
    private ChildReadBooks findReadBook(Long childId, Long fairytaleId) {
        return childReadBooksRepository.findByChildIdAndFairytaleId(childId, fairytaleId)
                .orElseThrow(() -> new CustomException(CHILD_READ_BOOK_NOT_FOUND));
    }
}