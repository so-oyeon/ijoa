package com.checkitout.ijoa.user.service;

import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.dto.UserSignupRequestDto;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.util.PasswordEncoder;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

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

}
