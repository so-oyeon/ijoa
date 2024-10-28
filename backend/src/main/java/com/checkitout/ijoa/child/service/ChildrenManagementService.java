package com.checkitout.ijoa.child.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.dto.request.CreateChildRequestDto;
import com.checkitout.ijoa.child.dto.response.CreateChildResponseDto;
import com.checkitout.ijoa.child.mapper.ChildMapper;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChildrenManagementService {

    private final ChildRepository childRepository;
    private final SecurityUtil securityUtil;
    private final ChildMapper childMapper;

    /**
     * 자녀 프로필 추가
     */
    @Transactional
    public CreateChildResponseDto createNewChildProfile(CreateChildRequestDto requestDto) {

        User user = securityUtil.getUserByToken();

        if (childRepository.countByParentAndIsDeletedFalse(user) >= 10) {
            throw new CustomException(ErrorCode.CHILD_LIMIT_EXCEEDED);
        }
        //TODO: 프로필 이미지 추가
        Child createdChild = Child.createChild(user, requestDto.getName(), requestDto.getBirth(),
                requestDto.getGender(),
                LocalDateTime.now());

        Child child = childRepository.save(createdChild);

        return childMapper.toCreateChildResponseDto(child);
    }
}
