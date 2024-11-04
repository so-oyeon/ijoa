package com.checkitout.ijoa.util;


import com.checkitout.ijoa.auth.authentication.CustomAuthentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityTestUtil {

    public static void setUpSecurityContext(Long userId, Long childId) {
        CustomAuthentication authentication = new CustomAuthentication(userId, childId);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
