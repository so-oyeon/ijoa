package com.checkitout.ijoa.fairytale.service;

import com.checkitout.ijoa.common.dto.PageRequestDto;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.mapper.FairytaleMapper;
import com.checkitout.ijoa.fairytale.repository.FairytaleRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class FairytaleListService {

    private final FairytaleRepository fairytaleRepository;
    private final SecurityUtil securityUtil;
    private final FairytaleMapper fairytaleMapper;
    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 동화책 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<FairytaleListResponseDto> getAllFairytale(PageRequestDto requestDto) {
        initializeDummyData();

        Long childId = securityUtil.getCurrentChildId();
        Pageable pageable = PageRequest.of(requestDto.getPage() - 1, requestDto.getSize());

        Page<Fairytale> fairytales = fairytaleRepository.findAllBy(pageable);

        List<FairytaleListResponseDto> responseDtos = fairytaleMapper.toFairytaleListResponseDtoList(
                fairytales.getContent(),
                childId);

        return new PageImpl<>(responseDtos, pageable, fairytales.getTotalElements());
    }

    /**
     * 동화책 카테고리별 조회
     */

    /**
     * Test용입니다. 더미데이터 추가
     */
    public void initializeDummyData() {
        Long childId = 7L;
        int[] bookIds = {1, 3, 5};
        int lastPage = 10;

        ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
        for (int bookId : bookIds) {
            String key = "currentPage:" + bookId + ":" + childId;
            valueOps.set(key, String.valueOf(lastPage));
        }
    }
}
