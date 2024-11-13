package com.checkitout.ijoa.user.service;

import com.checkitout.ijoa.child.domain.Child;
import com.checkitout.ijoa.child.service.ChildrenManagementService;
import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.dto.request.UserSignupRequestDto;
import com.checkitout.ijoa.user.dto.request.UserUpdateRequestDto;
import com.checkitout.ijoa.user.dto.response.UserDto;
import com.checkitout.ijoa.user.mapper.UserMapper;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.util.PasswordEncoder;
import com.checkitout.ijoa.util.SecurityUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ChildrenManagementService childrenManagementService;
    private final EmailServie emailServie;

    private final SecurityUtil securityUtil;
    private final UserMapper userMapper;

    /**
     * 회원가입
     */
    @Transactional
    public ResponseDto signUp(UserSignupRequestDto requestDto) {

        String email = requestDto.getEmail();
        String password = requestDto.getPassword();
        User user = User.createUser(email, PasswordEncoder.encrypt(email, password), requestDto.getNickname(),
                LocalDateTime.now());

        userRepository.save(user);

        return new ResponseDto();
    }

    /**
     * 이메일 중복 체크
     */
    @Transactional(readOnly = true)
    public ResponseDto checkEmailDuplication(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        } else {
            return new ResponseDto();
        }
    }

    /**
     * 회원 정보 조회
     */
    @Transactional(readOnly = true)
    public UserDto getUser() {

        User user = securityUtil.getUserByToken();

        return userMapper.toUserDto(user);
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    public UserDto updateUser(UserUpdateRequestDto requestDto) {

        User user = securityUtil.getUserByToken();

        String nickname = requestDto.getNickname();
        String password = requestDto.getPassword();

        if (nickname != null && !nickname.isEmpty()) {
            user.setNickname(nickname);
        }

        if (password != null && !password.isEmpty()) {
            String encryptedPassword = PasswordEncoder.encrypt(user.getEmail(), password);
            user.setPassword(encryptedPassword);
        }

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return userMapper.toUserDto(updatedUser);
    }

    /**
     * 회원 탈퇴
     */
    @Transactional
    public ResponseDto signOut() {

        //user 비활성화
        User user = securityUtil.getUserByToken();
        user.setEmail(null);
        user.setPassword(null);
        user.setDeactivated(true);
        user.setUpdatedAt(LocalDateTime.now());

        //child 비활성화
        List<Child> children = user.getChildren();
        for (Child child : children) {
            childrenManagementService.deleteChildProfile(child.getId());
        }

        return new ResponseDto();
    }

    /**
     * 비밀번호 재설정
     */
    @Transactional
    public ResponseDto resetUserPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.EMAIL_VERIFICATION_NOT_FOUND));

        String password = generateResetPassword();
        user.setPassword(PasswordEncoder.encrypt(user.getEmail(), password));

        emailServie.sendPasswordResetEmail(email, password);
        return new ResponseDto();
    }

    /**
     * 초기화된 비밀번호 생성
     */
    public String generateResetPassword() {
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(3);

            switch (index) {
                case 0 -> password.append((char) (random.nextInt(26) + 65)); // 대문자 A-Z
                case 1 -> password.append((char) (random.nextInt(26) + 97)); // 소문자 a-z
                case 2 -> password.append(random.nextInt(10)); // 숫자 0-9
            }
        }
        return password.toString();
    }

    // 튜토리얼 완료 처리
    public void completeTutorial(){
        User user = securityUtil.getUserByToken();
        user.setCompleteTutorial(true);
        userRepository.save(user);
    }
}
