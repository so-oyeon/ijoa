package com.checkitout.ijoa.util;

import com.checkitout.ijoa.auth.authentication.CustomAuthentication;
import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.user.domain.User;
import com.checkitout.ijoa.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            throw new CustomException(ErrorCode.INVALID_JWT_TOKEN);
        }

        return (Long) authentication.getPrincipal();
    }

    public Long getCurrentChildId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof CustomAuthentication) {
            return ((CustomAuthentication) authentication).getChildId();
        }

        return null;
    }

    public void setAuthentication(Long userId, Long childId, HttpServletRequest request) {

        CustomAuthentication customAuthentication = new CustomAuthentication(userId, childId);
        customAuthentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(customAuthentication);
        SecurityContextHolder.setContext(securityContext);
    }

    /*
     * 유저 엔티티 반환
     */
    public User getUserByToken() {
        Long userId = getCurrentUserId();
        return userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
