package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisEmail;
import com.checkitout.ijoa.auth.dto.request.EmailVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.LoginRequestDto;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.repository.redis.EmailRepository;
import com.checkitout.ijoa.auth.repository.redis.TokenRepository;
import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.user.service.EmailServie;
import com.checkitout.ijoa.util.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final EmailServie emailServie;
    private final TokenService tokenService;

    private final EmailRepository emailRepository;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    /**
     * 이메일 인증코드 전송
     */
    public ResponseDto sendEmailVerificationCode(String email) {

        String authCode = emailServie.sendEmail(email);
        emailRepository.save(new RedisEmail(email, authCode));

        return new ResponseDto();
    }

    /**
     * 이메일 인증코드 검증
     */
    public ResponseDto confirmEmailVerificationCode(EmailVerificationRequestDto requestDto) {

        RedisEmail email = emailRepository.findById(requestDto.getEmail()).orElseThrow(
                () -> new CustomException(ErrorCode.EMAIL_VERIFICATION_NOT_FOUND)
        );

        if (requestDto.getAuthCode().equals(email.getAuthCode())) {
            return new ResponseDto();
        } else {
            throw new CustomException(ErrorCode.INVALID_EMAIL_VERIFICATION_CODE);
        }
    }

    /**
     * 로그인
     */
    public LoginResponseDto login(LoginRequestDto requestDto) {

        String email = requestDto.getEmail();
        String encryptedPw = PasswordEncoder.encrypt(email, requestDto.getPassword());

        User user = validatePassword(email, encryptedPw);

        LoginResponseDto response = tokenService.saveRefreshToken(user.getId());
        response.setNickname(user.getNickname());

        return response;
    }

    /**
     * 비밀번호 검증
     */
    public User validatePassword(String email, String encryptedPw) {

        User user = userRepository.findByEmailAndPassword(email, encryptedPw)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return user;
    }
}
