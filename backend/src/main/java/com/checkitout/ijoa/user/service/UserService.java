package com.checkitout.ijoa.user.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
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
    public UserDto getUser() {

        User user = securityUtil.getUserByToken();

        return userMapper.toUserDto(user);
    }

    /**
     * 회원 정보 수정
     */
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
}
