package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisEmail;
import com.checkitout.ijoa.auth.repository.redis.EmailRepository;
import com.checkitout.ijoa.common.dto.ResponseDto;
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
    public ResponseDto setEmailVerificationCode(String email) {

        String authCode = emailServie.sendEmail(email);
        emailRepository.save(new RedisEmail(email, authCode));

        return new ResponseDto();
    }
}
