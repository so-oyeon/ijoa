package com.checkitout.ijoa.fairytale.service;

import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_NOT_FOUND;

import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.dto.FairytalePageViewResponse;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationRequest;
import com.checkitout.ijoa.fairytale.dto.PageHistoryCreationResponse;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
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
    private final SecurityUtil securityUtil;

    @Transactional(readOnly = true)
    public List<FairytalePageListResponse> getFairytalePageList(Long fairytaleId) {
        Fairytale fairytale = getFairytaleById(fairytaleId);

        return convertToFairytalePageListResponse(fairytale);
    }

    public FairytalePageViewResponse getFairytalePage(Long fairytaleId, Integer pageNumber) {
        Fairytale fairytale = getFairytaleById(fairytaleId);

//        securityUtil.getUserByToken();

        return FairytalePageViewResponse.test(pageNumber);
    }

    public PageHistoryCreationResponse createPageHistory(Long fairytaleId, PageHistoryCreationRequest request) {
        Fairytale fairytale = getFairytaleById(fairytaleId);

//        securityUtil.getUserByToken();

        return PageHistoryCreationResponse.test();
    }

    private Fairytale getFairytaleById(Long fairytaleId) {
        return fairytaleRepository.findById(fairytaleId)
                .orElseThrow(() -> new CustomException(FAIRYTALE_NOT_FOUND));
    }

    private List<FairytalePageListResponse> convertToFairytalePageListResponse(Fairytale fairytale) {
        return fairytale.getFairytalePageImages().stream()
                .map(FairytalePageListResponse::from)
                .collect(Collectors.toList());
    }
}
