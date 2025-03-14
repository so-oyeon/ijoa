package com.checkitout.ijoa.child.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.domain.Enum.Gender;
import com.checkitout.ijoa.child.dto.request.CreateChildRequestDto;
import com.checkitout.ijoa.child.dto.request.UpdateChildRequestDto;
import com.checkitout.ijoa.child.dto.response.ChildDto;
import com.checkitout.ijoa.child.mapper.ChildMapper;
import com.checkitout.ijoa.child.repository.ChildRepository;
import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.file.service.FileService;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.util.SecurityUtil;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
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

        String profileUrl = determineProfileUrl(requestDto.getProfileImg(), requestDto.getGender());

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

    /**
     * 자녀 프로필 수정
     */
    @Transactional
    public ChildDto updateChildProfile(Long childId, UpdateChildRequestDto requestDto) throws IOException {

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND));
        verifyChildParentRelationship(child);

        String name = requestDto.getName();
        LocalDate birth = requestDto.getBirth();
        Gender gender = requestDto.getGender();
        MultipartFile file = requestDto.getProfileImg();

        if (name != null && !name.isEmpty()) {
            child.setName(name);
        }

        if (birth != null) {
            child.setBirth(birth);
        }

        if (file != null && !file.isEmpty()) {

            deleteProfile(child);

            String profileUrl = determineProfileUrl(file, gender);
            child.setProfile(profileUrl);
        } else if (gender != null && (file == null || file.isEmpty())) {
            child.setGender(gender);

            if (child.getProfile().equals(GIRL_PROFILE_DEFAULT_URL) || child.getProfile()
                    .equals(BOY_PROFILE_DEFAULT_URL)) {
                String profileUrl = determineProfileUrl(null, gender);
                child.setProfile(profileUrl);
            }
        }

        child.setUpdatedAt(LocalDateTime.now());
        Child updatedChild = childRepository.save(child);
        return childMapper.toChildDto(updatedChild);
    }

    /**
     * 자녀 프로필 삭제
     */
    public ResponseDto deleteChildProfile(Long childId) {

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND));
        verifyChildParentRelationship(child);

        deleteProfile(child);

        child.setBirth(null);
        child.setGender(null);
        child.setProfile(null);
        child.setDeleted(true);
        child.setUpdatedAt(LocalDateTime.now());

        return new ResponseDto();
    }

    /**
     * 자녀 프로필 단건 조회
     */
    @Transactional(readOnly = true)
    public ChildDto getChildProfile(Long childId) {

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHILD_NOT_FOUND));

        verifyChildParentRelationship(child);

        return childMapper.toChildDto(child);
    }

    /**
     * 자녀 프로필 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ChildDto> getAllChildProfiles() {

        User user = securityUtil.getUserByToken();

        List<Child> activeChildren = childRepository.findByParentAndIsDeletedFalse(user)
                .orElseGet(Collections::emptyList);

        if (activeChildren.isEmpty()) {
            throw new CustomException(ErrorCode.CHILD_NO_CONTENT);
        }

        return childMapper.toChildDtoList(activeChildren);
    }

    /**
     * 자녀 유효성 검사 메서드
     */
    public void verifyChildParentRelationship(Child child) {

        Long userId = securityUtil.getCurrentUserId();

        if (child.getParent().getId() != userId) {
            throw new CustomException(ErrorCode.CHILD_NOT_BELONG_TO_PARENT);
        }
    }

    /**
     * 프로필 사진 url 저장 및 결정 메서드
     */
    private String determineProfileUrl(MultipartFile file, Gender gender) throws IOException {
        if (file != null && !file.isEmpty()) {
            return fileService.saveProfileImage(file);
        }
        return (gender == Gender.MALE) ? BOY_PROFILE_DEFAULT_URL : GIRL_PROFILE_DEFAULT_URL;
    }

    /**
     * S3 사진 삭제용 key 조회 메서드
     */
    public String getKeyFromUrl(String url) {
        return url.replace("https://checkitout-bucket.s3.ap-northeast-2.amazonaws.com/", "");
    }

    /**
     * S3에 업로드된 프로필 삭제 메서드
     */
    public void deleteProfile(Child child) {

        String profileUrl = child.getProfile();

        if (profileUrl == null || profileUrl.isEmpty()) {
            return;
        }

        if (!profileUrl.equals(GIRL_PROFILE_DEFAULT_URL) && !profileUrl.equals(BOY_PROFILE_DEFAULT_URL)) {
            fileService.deleteFile(getKeyFromUrl(child.getProfile()));
        }
    }
}
