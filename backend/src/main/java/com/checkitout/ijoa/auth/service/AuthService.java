package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisEmail;
import com.checkitout.ijoa.auth.dto.request.EmailVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.request.LoginRequestDto;
import com.checkitout.ijoa.auth.dto.request.PasswordVerificationRequestDto;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.repository.redis.EmailRepository;
import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import com.checkitout.ijoa.user.service.EmailServie;
import com.checkitout.ijoa.util.PasswordEncoder;
import com.checkitout.ijoa.util.SecurityUtil;
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

    private final SecurityUtil securityUtil;

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

        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        validatePassword(user, requestDto.getPassword());

        LoginResponseDto response = tokenService.saveRefreshToken(user.getId());
        response.setNickname(user.getNickname());

        return response;
    }

    /**
     * 비밀번호 검증 API용 메서드
     */
    public ResponseDto verifyPassword(PasswordVerificationRequestDto requestDto) {

        User user = securityUtil.getUserByToken();
        validatePassword(user, requestDto.getPassword());

        return new ResponseDto();
    }

    /**
     * 비밀번호 검증 메서드
     */
    @Transactional(readOnly = true)
    public void validatePassword(User user, String password) {

        String email = user.getEmail();
        String encryptedPw = PasswordEncoder.encrypt(email, password);

        if (!user.getPassword().equals(encryptedPw)) {
            throw new CustomException(ErrorCode.PASSWORD_MISMATCH);
        }
    }
}
