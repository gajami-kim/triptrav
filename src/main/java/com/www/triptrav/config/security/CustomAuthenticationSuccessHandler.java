package com.www.triptrav.config.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 쿠키에서 'url' 값 가져오기
        Cookie[] cookies = request.getCookies();
        log.info("로그인 성공");
        String returnUrl = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                log.info("cookie getName : " + cookie.getName());
                if (cookie.getName().equals("url")) {
                    returnUrl = cookie.getValue();  // 쿠키 값이 URL 그대로 들어가 있으므로 사용
                    log.info("return Url : {}", returnUrl);
                    break;
                }
            }
        }

        // returnUrl이 있을 경우 그 URL로 리다이렉트
        if (returnUrl != null && !returnUrl.isEmpty()) {
            getRedirectStrategy().sendRedirect(request, response, returnUrl);
            log.info("Redirected to return URL: {}", returnUrl);
            return;
        }

        // 기본 리다이렉트 동작 (메인 페이지로 리다이렉트)
        super.onAuthenticationSuccess(request, response, authentication);
    }
}