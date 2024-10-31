package com.checkitout.ijoa.child.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.child.dto.request.CreateChildRequestDto;
import com.checkitout.ijoa.child.dto.response.ChildDto;
import com.checkitout.ijoa.child.mapper.ChildMapper;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.file.service.FileService;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import java.io.IOException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ChildrenManagementService {

    private final ChildRepository childRepository;
    private final FileService fileService;
    private final SecurityUtil securityUtil;
    private final ChildMapper childMapper;
    @Value("${GIRL_PROFILE_DEFAULT_URL}")
    private String GIRL_PROFILE_DEFAULT_URL;
    @Value("${BOY_PROFILE_DEFAULT_URL}")
    private String BOY_PROFILE_DEFAULT_URL;

    /**
     * 자녀 프로필 추가
     */
    @Transactional
    public ChildDto createNewChildProfile(CreateChildRequestDto requestDto) throws IOException {

        User user = securityUtil.getUserByToken();

        if (childRepository.countByParentAndIsDeletedFalse(user) >= 10) {
            throw new CustomException(ErrorCode.CHILD_LIMIT_EXCEEDED);
        }

        MultipartFile file = requestDto.getProfileImg();
        String profileUrl = "";
        if (file != null && !file.isEmpty()) {

            profileUrl = fileService.saveProfileImage(file);
        } else {

            profileUrl = requestDto.getGender() == Gender.MALE ? BOY_PROFILE_DEFAULT_URL : GIRL_PROFILE_DEFAULT_URL;
        }

        Child createdChild = Child.createChild(
                user,
                requestDto.getName(),
                profileUrl,
                requestDto.getBirth(),
                requestDto.getGender(),
                LocalDateTime.now()
        );

        Child child = childRepository.save(createdChild);
        return childMapper.toChildDto(child);
    }

    @Transactional(readOnly = true)
    public ChildDto getChildProfile(Long childId) {

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND));

        verifyChildParentRelationship(child);

        return childMapper.toChildDto(child);
    }


    public void verifyChildParentRelationship(Child child) {

        Long userId = securityUtil.getCurrentUserId();

        if (child.getParent().getId() != userId) {
            throw new CustomException(ErrorCode.CHILD_NOT_BELONG_TO_PARENT);
        }
    }
}
