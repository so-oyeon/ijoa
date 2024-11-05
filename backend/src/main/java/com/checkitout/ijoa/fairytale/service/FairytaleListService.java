package com.checkitout.ijoa.fairytale.service;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class FairytaleListService {

    private final FairytaleRepository fairytaleRepository;
    private final SecurityUtil securityUtil;

    /**
     * 동화책 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<FairytaleListResponseDto> getAllFairytale(PageRequestDto requestDto) {

        Long childId = securityUtil.getCurrentChildId();
        Pageable pageable = PageRequest.of(requestDto.getPage() - 1, requestDto.getSize());

        return fairytaleRepository.findFairytalesByChildId(childId, pageable);
    }

    /**
     * 동화책 카테고리별 조회
     */
}
