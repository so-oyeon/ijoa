package com.checkitout.ijoa.auth.provider;


import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    @Value("${JWT_SECRET_KEY}")
    private String JWT_KEY;

    private Key getKey() {
        return Keys.hmacShaKeyFor(JWT_KEY.getBytes());
    }

    /**
     * 토큰 생성
     */
    private String generateToken(String subject, int days, Long userId) {

        Date expiredDate = Date.from(Instant.now().plus(days, ChronoUnit.DAYS));

        Claims claims = Jwts.claims().setSubject(subject);
        claims.put("userId", userId);

        String jwt = Jwts.builder()
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .setSubject(subject)
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(expiredDate)
                .compact();

        return jwt;
    }

    /**
     * AccessToken 생성
     */
    public String generateAccessToken(Long userId) {
        return generateToken("accessToken", 7, userId);
    }

    /**
     * RefreshToken 생성
     */
    public String generagteRefreshToken(Long userId) {
        return generateToken("refreshToken", 7, userId);
    }

    /**
     * Jwt 유효성 검증
     *
     * @return userId
     */
    public Long validateToken(String jwt) throws ExpiredJwtException {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.get("userId", Long.class);
        } catch (ExpiredJwtException expiredJwtException) {
            throw expiredJwtException;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_JWT_TOKEN);
        }
    }
}
