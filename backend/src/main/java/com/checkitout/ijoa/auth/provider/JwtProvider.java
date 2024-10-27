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
    private String generateToken(String subject, int days, Long userId, Long childId) {
        Date expiredDate = Date.from(Instant.now().plus(days, ChronoUnit.DAYS));

        Claims claims = Jwts.claims().setSubject(subject);
        claims.put("userId", userId);
        if (childId != null) {
            claims.put("childId", childId);
        }

        String jwt = Jwts.builder()
                .setClaims(claims)
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .setIssuedAt(new Date())
                .setExpiration(expiredDate)
                .compact();

        return jwt;
    }

    /**
     * AccessToken 생성
     */
    public String generateAccessToken(Long userId, Long childId) {
        return generateToken("accessToken", 1, userId, childId);
    }

    /**
     * RefreshToken 생성
     */
    public String generagteRefreshToken(Long userId, Long childId) {
        return generateToken("refreshToken", 7, userId, childId);
    }

    /**
     * Jwt 유효성 검증
     *
     * @return Claims 객체
     */
    public Claims validateToken(String jwt) throws ExpiredJwtException {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
        } catch (ExpiredJwtException expiredJwtException) {
            throw expiredJwtException;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INVALID_JWT_TOKEN);
        }
    }
}
