package com.checkitout.ijoa.auth.filter;

import com.checkitout.ijoa.exception.CustomException;
import com.checkitout.ijoa.exception.ErrorCode;
import com.checkitout.ijoa.util.LogUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ExceptionHandlerFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            filterChain.doFilter(request, response);

        } catch (CustomException customException) {
            ErrorCode errorCode = customException.getErrorCode();
            LogUtil.error(customException.getMessage());
            response.sendError(errorCode.getHttpStatus().value(), errorCode.getMessage());

        } catch (Exception e) {
            LogUtil.error(e.getMessage());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "서버에서 오류가 발생했습니다");
        }
    }
}
