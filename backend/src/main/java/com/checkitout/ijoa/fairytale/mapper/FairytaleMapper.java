package com.checkitout.ijoa.fairytale.mapper;

import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.Fairytale;
import com.checkitout.ijoa.fairytale.domain.redis.RedisReadBook;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.fairytale.repository.redis.RedisReadBookRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class FairytaleMapper {

    @Autowired
    private ChildReadBooksRepository childReadBooksRepository;

    @Autowired
    private RedisReadBookRepository redisReadBookRepository;

    @Mapping(target = "fairytaleId", expression = "java(fairytale.getId())")
    @Mapping(target = "image", expression = "java(fairytale.getImageUrl())")
    @Mapping(target = "progressRate", expression = "java(calculateProgressRate(fairytale, childId))")
    @Mapping(target = "currentPage", expression = "java(getReadBookData(fairytale.getId(), childId).getCurrentPage())")
    @Mapping(target = "isCompleted", expression = "java(getReadBookData(fairytale.getId(), childId).isCompleted())")
    public abstract FairytaleListResponseDto toFairytaleListResponseDto(Fairytale fairytale, Long childId);

    public List<FairytaleListResponseDto> toFairytaleListResponseDtoList(List<Fairytale> fairytales, Long childId) {
        return fairytales.stream()
                .map(fairytale -> toFairytaleListResponseDto(fairytale, childId))
                .collect(Collectors.toList());
    }

    /**
     * Redis 캐시에서 조회 또는 DB 조회 후 캐시에 저장
     */
    protected RedisReadBook getReadBookData(Long bookId, Long childId) {
        String key = bookId + ":" + childId;

        // Redis 캐시에서 조회
        RedisReadBook redisReadBook = redisReadBookRepository.findById(key).orElse(null);
        if (redisReadBook != null) {
            return redisReadBook;
        }

        // 캐시에 없으면 DB에서 조회
        ChildReadBooks childReadBooks = findChildReadBooks(bookId, childId);
        int currentPage = (childReadBooks != null) ? childReadBooks.getCurrentPage() : 0;
        boolean isCompleted = (childReadBooks != null) && childReadBooks.getIsCompleted();

        //캐싱
        redisReadBook = new RedisReadBook(bookId, childId, currentPage, isCompleted);
        redisReadBookRepository.save(redisReadBook);

        return redisReadBook;
    }

    /**
     * 진행도 계산
     */
    protected int calculateProgressRate(Fairytale fairytale, Long childId) {
        int lastReadPage = getReadBookData(fairytale.getId(), childId).getCurrentPage();
        return Math.round((float) lastReadPage / fairytale.getTotalPages() * 100);
    }

    /**
     * 읽은책 table 조회 (DB 접근)
     */
    private ChildReadBooks findChildReadBooks(Long bookId, Long childId) {
        return childReadBooksRepository.findByChildIdAndFairytaleId(childId, bookId).orElse(null);
    }
}
