package com.checkitout.ijoa.fairytale.mapper;

import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@Mapper(componentModel = "spring")
public abstract class FairytaleMapper {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private ChildReadBooksRepository childReadBooksRepository;

    @Mapping(target = "fairytaleId", expression = "java(fairytale.getId())")
    @Mapping(target = "image", expression = "java(fairytale.getImageUrl())")
    @Mapping(target = "progressRate", expression = "java(calculateProgressRate(fairytale, childId))")
    @Mapping(target = "currentPage", expression = "java(getCurrentPageFromCache(fairytale.getId(), childId))")
    @Mapping(target = "isCompleted", expression = "java(isCompleted(fairytale.getId(), fairytale.getTotalPages(), childId))")
    public abstract FairytaleListResponseDto toFairytaleListResponseDto(Fairytale fairytale, Long childId);

    public List<FairytaleListResponseDto> toFairytaleListResponseDtoList(List<Fairytale> fairytales, Long childId) {
        return fairytales.stream()
                .map(fairytale -> toFairytaleListResponseDto(fairytale, childId))
                .collect(Collectors.toList());
    }

    /**
     * 현재 페이지 조회 (Redis 캐싱)
     */
    protected int getCurrentPageFromCache(Long bookId, Long childId) {
        String redisKey = "currentPage:" + bookId + ":" + childId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String currentPageStr = ops.get(redisKey);
        if (currentPageStr != null) {
            return Integer.parseInt(currentPageStr);
        }

        int currentPageFromDb = findCurrentPageFromChildReadBooks(bookId, childId);
        ops.set(redisKey, String.valueOf(currentPageFromDb), Duration.ofDays(3));

        return currentPageFromDb;
    }

    /**
     * 진행도 계산
     */
    protected int calculateProgressRate(Fairytale fairytale, Long childId) {
        int lastReadPage = getCurrentPageFromCache(fairytale.getId(), childId);
        return Math.round((float) lastReadPage / fairytale.getTotalPages() * 100);
    }

    /**
     * 완독여부 계산
     */
    protected boolean isCompleted(Long bookId, int totalPages, Long childId) {
        int currentPage = getCurrentPageFromCache(bookId, childId);
        return currentPage == totalPages;
    }

    /**
     * 현재 페이지 조회 (DB 접근)
     */
    private int findCurrentPageFromChildReadBooks(Long bookId, Long childId) {

        ChildReadBooks childReadBooks = childReadBooksRepository.findTopByChildIdAndFairytaleIdOrderByCreatedAtDesc(
                bookId, childId).orElse(null);

        return childReadBooks == null ? 0 : childReadBooks.getCurrentPage();
    }
}
