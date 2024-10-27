package com.checkitout.ijoa.auth.service;

import com.checkitout.ijoa.auth.domain.redis.RedisToken;
import com.checkitout.ijoa.auth.dto.response.LoginResponseDto;
import com.checkitout.ijoa.auth.provider.JwtProvider;
import com.checkitout.ijoa.auth.repository.redis.TokenRepository;
import io.jsonwebtoken.Claims;
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
        return saveRefreshToken(userId, null);
    }

    public LoginResponseDto saveRefreshToken(Long userId, Long childId) {

        String accessToken = jwtProvider.generateAccessToken(userId, childId);
        String refreshToken = jwtProvider.generagteRefreshToken(userId, childId);

        tokenRepository.save(new RedisToken(userId, refreshToken));
        return new LoginResponseDto(userId, accessToken, refreshToken);
    }

    public LoginResponseDto switchToChild(Long userId, Long childId) {

        String accessToken = jwtProvider.generateAccessToken(userId, childId);
        String refreshToken = jwtProvider.generagteRefreshToken(userId, childId);

        tokenRepository.save(new RedisToken(userId, refreshToken));
        return new LoginResponseDto(userId, accessToken, refreshToken);
    }

    public Long getUserIdFromRefreshToken(String refreshToken) {

        Claims claims = jwtProvider.validateToken(refreshToken);
        return claims.get("userId", Long.class);
    }

    public Long getChildIdFromRefreshToken(String refreshToken) {

        Claims claims = jwtProvider.validateToken(refreshToken);
        return claims.get("childId", Long.class);
    }
}
