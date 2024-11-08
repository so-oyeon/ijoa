package com.checkitout.ijoa.fairytale.mapper;

import com.checkitout.ijoa.fairytale.domain.ChildReadBooks;
import com.checkitout.ijoa.fairytale.domain.redis.RedisReadBook;
import com.checkitout.ijoa.fairytale.dto.response.FairytaleListResponseDto;
import com.checkitout.ijoa.fairytale.repository.redis.RedisReadBookRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ChildReadBooksMapper {

    @Autowired
    private RedisReadBookRepository redisReadBookRepository;

    @Mapping(target = "fairytaleId", source = "childReadBooks.fairytale.id")
    @Mapping(target = "title", source = "childReadBooks.fairytale.title")
    @Mapping(target = "image", source = "childReadBooks.fairytale.imageUrl")
    @Mapping(target = "totalPages", source = "childReadBooks.fairytale.totalPages")
    @Mapping(target = "currentPage", expression = "java(getReadBookCache(childReadBooks.getFairytale().getId(), childReadBooks.getChild().getId(), childReadBooks))")
    @Mapping(target = "isCompleted", source = "childReadBooks.isCompleted")
    @Mapping(target = "progressRate", expression = "java(calculateProgressRate(childReadBooks))")
    public abstract FairytaleListResponseDto toFairytaleListResponseDto(ChildReadBooks childReadBooks);


    public List<FairytaleListResponseDto> toFairytaleListResponseDtoList(List<ChildReadBooks> childReadBooksList) {
        return childReadBooksList.stream()
                .map(this::toFairytaleListResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Redis 캐시에서 조회
     */
    protected int getReadBookCache(Long bookId, Long childId, ChildReadBooks childReadBooks) {
        String key = bookId + ":" + childId;

        // Redis 캐시에서 조회
        RedisReadBook redisReadBook = redisReadBookRepository.findById(key).orElse(null);
        if (redisReadBook != null) {
            return redisReadBook.getCurrentPage();
        }

        return childReadBooks.getCurrentPage();
    }

    /**
     * 진행률 계산
     */
    protected int calculateProgressRate(ChildReadBooks childReadBooks) {
        int currentPage = getReadBookCache(childReadBooks.getFairytale().getId(), childReadBooks.getChild().getId(),
                childReadBooks);
        int totalPages = childReadBooks.getFairytale().getTotalPages();

        if (totalPages == 0) {
            return 0;
        }

        return Math.round((float) currentPage / totalPages * 100);
    }
}
