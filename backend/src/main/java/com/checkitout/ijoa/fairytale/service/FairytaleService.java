package com.checkitout.ijoa.fairytale.service;

import static com.checkitout.ijoa.exception.ErrorCode.FAIRYTALE_NOT_FOUND;

import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.dto.FairytalePageListResponse;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FairytaleService {
    private final FairytaleRepository fairytaleRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "fairytalePages", key = "#fairytaleId  + 'pages'")
    public List<FairytalePageListResponse> getFairytalePageList(Long fairytaleId) {
        Fairytale fairytale = getFairytaleById(fairytaleId);

        return convertToFairytalePageListResponse(fairytale);
    }

    private Fairytale getFairytaleById(Long fairytaleId) {
        return fairytaleRepository.findById(fairytaleId)
                .orElseThrow(() -> new CustomException(FAIRYTALE_NOT_FOUND));
    }

    private List<FairytalePageListResponse> convertToFairytalePageListResponse(Fairytale fairytale) {
        return fairytale.getFairytalePages().stream()
                .map(FairytalePageListResponse::from)
                .collect(Collectors.toList());
    }
}
