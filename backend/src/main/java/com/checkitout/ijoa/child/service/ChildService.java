package com.checkitout.ijoa.child.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.dto.response.ChildLevelResponseDto;
import com.checkitout.ijoa.fairytale.repository.ChildReadBooksRepository;
import com.checkitout.ijoa.util.SecurityUtil;
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

        long totalCount = calculateTotalFairytaleCount();
        int level = determineLevel(totalCount);

        return ChildLevelResponseDto.of(totalCount, level);
    }

    public long calculateTotalFairytaleCount() {
        Child child = securityUtil.getChildByToken();

        return readBooksRepository.countByChildAndIsCompletedTrue(child);
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
