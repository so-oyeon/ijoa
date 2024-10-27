package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisToken;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.provider.JwtProvider;
import com.checkitout.ijoa.auth.repository.redis.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenService {

    private final JwtProvider jwtProvider;
    private final TokenRepository tokenRepository;

    public LoginResponseDto saveRefreshToken(Long userId) {

        String accessToken = jwtProvider.generateAccessToken(userId);
        String refreshToken = jwtProvider.generagteRefreshToken(userId);

        tokenRepository.save(new RedisToken(userId, refreshToken));
        return new LoginResponseDto(userId, accessToken, refreshToken);
    }

    public Long getUserIdFromRefreshToken(String refreshToken) {
        return jwtProvider.validateToken(refreshToken);
    }
}
