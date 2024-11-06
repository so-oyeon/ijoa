package com.checkitout.ijoa.child.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.dto.response.ChildLevelResponseDto;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.util.SecurityUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChildService {

    private final SecurityUtil securityUtil;
    private final ChildReadBooksRepository readBooksRepository;

    @Value("${CHILD_LEVEL1}")
    private int LEVEL1;

    @Value("${CHILD_LEVEL2}")
    private int LEVEL2;

    @Value("${CHILD_LEVEL3}")
    private int LEVEL3;

    public ChildLevelResponseDto getChildLevel() {

        long totalCount = calculateTotalCategoryCount();
        int level = determineLevel(totalCount);

        return ChildLevelResponseDto.of(totalCount, level);
    }

    public long calculateTotalCategoryCount() {
        Child child = securityUtil.getChildByToken();
        List<Object[]> results = readBooksRepository.countByCategoryAndChild(child);

        return results.stream()
                .mapToLong(result -> (Long) result[1]) // count 값 추출
                .sum();
    }

    public int determineLevel(long totalCount) {

        if (totalCount <= LEVEL1) {
            return 1;
        } else if (totalCount <= LEVEL2) {
            return 2;
        } else if (totalCount <= LEVEL3) {
            return 3;
        } else {
            return 4;
        }
    }
}
