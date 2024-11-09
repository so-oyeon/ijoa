package com.checkitout.ijoa.fairytale.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.mapper.ChildReadBooksMapper;
import com.checkitout.ijoa.fairytale.mapper.FairytaleMapper;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class FairytaleListService {

    private final FairytaleRepository fairytaleRepository;
    private final FairytaleMapper fairytaleMapper;

    private final ChildReadBooksRepository childReadBooksRepository;
    private final ChildReadBooksMapper childReadBooksMapper;

    private final SecurityUtil securityUtil;

    @Value("${RECOMMENDATION_COUNT}")
    private Integer recommendationCount;

    /**
     * 동화책 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<FairytaleListResponseDto> getAllFairytale(PageRequestDto requestDto) {

        Long childId = securityUtil.getChildByToken().getId();
        Pageable pageable = PageRequest.of(requestDto.getPage() - 1, requestDto.getSize());

        Page<Fairytale> fairytales = fairytaleRepository.findAllBy(pageable);
        if (fairytales.isEmpty()) {
            throw new CustomException(ErrorCode.FAIRYTALE_NO_CONTENT);
        }

        List<FairytaleListResponseDto> responseDtos = fairytaleMapper.toFairytaleListResponseDtoList(
                fairytales.getContent(), childId);

        return new PageImpl<>(responseDtos, pageable, fairytales.getTotalElements());
    }

    /**
     * 카테고리별 목록 조회 메서드
     */
    @Transactional(readOnly = true)
    public Page<FairytaleListResponseDto> getFairytalesByCategory(CATEGORY category, PageRequestDto requestDto) {

        Long childId = securityUtil.getChildByToken().getId();
        Pageable pageable = PageRequest.of(requestDto.getPage() - 1, requestDto.getSize());

        Page<Fairytale> fairytales = fairytaleRepository.findByCategory(category, pageable);
        if (fairytales.isEmpty()) {
            throw new CustomException(ErrorCode.FAIRYTALE_NO_CONTENT);
        }
        List<FairytaleListResponseDto> responseDtos = fairytaleMapper.toFairytaleListResponseDtoList(
                fairytales.getContent(), childId);

        return new PageImpl<>(responseDtos, pageable, fairytales.getTotalElements());
    }

    /**
     * 나이대 인기 도서 조회
     */
    @Transactional(readOnly = true)
    public List<FairytaleListResponseDto> getFairytaleRank() {
        Child child = securityUtil.getChildByToken();

        List<Fairytale> fairytales = fairytaleRepository.findPopularFairytalesByAgeGroup(child.getBirth(),
                recommendationCount);

        return fairytaleMapper.toFairytaleListResponseDtoList(fairytales, child.getId());
    }


    /**
     * 읽은책/읽고있는 책 목록 조회 메서드
     */
    @Transactional(readOnly = true)
    public Page<FairytaleListResponseDto> readFairytaleList(PageRequestDto requestDto) {

        Long childId = securityUtil.getChildByToken().getId();
        Pageable pageable = PageRequest.of(requestDto.getPage() - 1, requestDto.getSize());

        Page<ChildReadBooks> fairytales = childReadBooksRepository.findByChildIdOrderByFairytaleIdAsc(childId,
                pageable);
        if (fairytales.isEmpty()) {
            throw new CustomException(ErrorCode.FAIRYTALE_NO_CONTENT);
        }

        List<FairytaleListResponseDto> responseDtos = childReadBooksMapper.toFairytaleListResponseDtoList(
                fairytales.getContent());

        return new PageImpl<>(responseDtos, pageable, fairytales.getTotalElements());
    }
}
