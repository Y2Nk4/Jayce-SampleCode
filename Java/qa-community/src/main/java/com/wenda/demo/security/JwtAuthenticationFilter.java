package com.wenda.demo.security;

import com.wenda.demo.utils.JwtSecurityConstant;
import com.wenda.demo.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    protected JwtAuthenticationFilter(@Autowired JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * 从 HTTP 请求中获取 token
     *
     * @param request HTTP 请求
     * @return 返回 token
     */
    private String getTokenFromHttpRequest(HttpServletRequest request) {
        String authorization = request.getHeader(JwtSecurityConstant.HEADER_STRING);
        if (authorization == null || !authorization.startsWith(JwtSecurityConstant.TOKEN_PREFIX)) {
            return null;
        }
        return authorization.replace(JwtSecurityConstant.TOKEN_PREFIX, "");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("doFilterInternal");
        String token = this.getTokenFromHttpRequest(request);
        // 验证 token 是否有效
        if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
            // 获取认证信息
            Authentication authentication = jwtUtil.getAuthentication(token);
            // 将认证信息存入 Spring 安全上下文中
            SecurityContextHolder.getContext().setAuthentication(authentication);

            logger.info("Passed");
        } else {
            Authentication authentication = new AnonymousAuthenticationToken();
            // 将认证信息存入 Spring 安全上下文中
            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("Anonymous Passed");
        }
        filterChain.doFilter(request, response);
    }
}