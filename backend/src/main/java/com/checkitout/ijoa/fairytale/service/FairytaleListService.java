package com.checkitout.ijoa.fairytale.service;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.fairytale.domain.CATEGORY;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.redis.RedisReadBook;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.mapper.FairytaleMapper;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.fairytale.repository.redis.RedisReadBookRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
    private final SecurityUtil securityUtil;
    private final FairytaleMapper fairytaleMapper;
    private final RedisReadBookRepository redisReadBookRepository;

    /**
     * 동화책 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<FairytaleListResponseDto> getAllFairytale(PageRequestDto requestDto) {
        //초기데이터 생성
//        initializeDummyData();

        Long childId = securityUtil.getCurrentChildId();
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

        Long childId = securityUtil.getCurrentChildId();
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
     * Test용입니다. 더미데이터 추가
     */
    public void initializeDummyData() {
        Long childId = 7L;
        Long[] bookIds = {1L, 3L, 5L};
        int lastPage = 10;

        for (Long bookId : bookIds) {

            redisReadBookRepository.save(new RedisReadBook(bookId, childId, lastPage, false));
        }
    }
}
