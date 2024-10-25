package com.checkitout.ijoa.service.user;

import com.checkitout.ijoa.domain.User;
import com.checkitout.ijoa.dto.ResponseDto;
import com.checkitout.ijoa.dto.user.UserSignupRequestDto;
import com.checkitout.ijoa.repository.UserRepository;
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
    public ResponseDto signUp(UserSignupRequestDto requestDto) {

        String email = requestDto.getEmail();
        String password = requestDto.getPassword();
        User user = User.createUser(email, PasswordEncoder.encrypt(email, password), requestDto.getNickname(),
                LocalDateTime.now());

        userRepository.save(user);

        return new ResponseDto();
    }
}
