package com.checkitout.ijoa.auth.filter;

import com.checkitout.ijoa.auth.authentication.CustomAuthentication;
import com.checkitout.ijoa.auth.provider.JwtProvider;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.util.LogUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAutheticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String token = parseBearerToken(request);
            if (token == null) {
                throw new CustomException(ErrorCode.INVALID_JWT_TOKEN);
            }

            Claims claims = jwtProvider.validateToken(token);
            Long userId = claims.get("userId", Long.class);
            Long childId = claims.get("childId", Long.class);

            CustomAuthentication customAuthentication = new CustomAuthentication(userId, childId);
            customAuthentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(customAuthentication);
            SecurityContextHolder.setContext(securityContext);
        } catch (Exception e) {
            LogUtil.error("", e.getMessage());
        } finally {
            filterChain.doFilter(request, response);
        }
    }

    private String parseBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");

        if (!StringUtils.hasText(authorization)) {
            return null;
        }

        if (!authorization.startsWith("Bearer ")) {
            return null;
        }
        return authorization.substring(7);
    }
}
