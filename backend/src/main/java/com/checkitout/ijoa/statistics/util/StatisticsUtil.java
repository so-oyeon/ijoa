package com.checkitout.ijoa.statistics.util;


import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_BELONG_TO_PARENT;
import static com.checkitout.ijoa.exception.ErrorCode.CHILD_NOT_FOUND;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.user.domain.User;
import java.util.Objects;

public class StatisticsUtil {

    // 아이 조회
    public static Child getChildById(ChildRepository childRepository, Long childId) {
        return childRepository.findById(childId).orElseThrow(() -> new CustomException(CHILD_NOT_FOUND));
    }

    // 아이 접근 권한 검증
    public static void validateChildAccess(User user, Child child) {
        if (!Objects.equals(user.getId(), child.getParent().getId())) {
            throw new CustomException(CHILD_NOT_BELONG_TO_PARENT);
        }
    }
}
