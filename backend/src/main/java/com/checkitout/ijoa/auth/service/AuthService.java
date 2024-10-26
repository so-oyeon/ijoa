package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisEmail;
import com.checkitout.ijoa.auth.dto.EmailVerificationRequestDto;
import com.checkitout.ijoa.auth.repository.redis.EmailRepository;
import com.checkitout.ijoa.common.dto.ResponseDto;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.service.EmailServie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final EmailServie emailServie;

    private final EmailRepository emailRepository;

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
}
