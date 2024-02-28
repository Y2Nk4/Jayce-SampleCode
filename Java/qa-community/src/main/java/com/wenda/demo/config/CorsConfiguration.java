package com.wenda.demo.config;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@AllArgsConstructor
public class CorsConfiguration implements WebMvcConfigurer {
    @Autowired
    private final Environment environment;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String origins = environment.getProperty("ALLOWED_ORIGINS",  "http://localhost:3000");

        registry.addMapping("/**")
                // 表明允许哪些域访问, 简单点可为 *
                .allowedOrigins(origins.split(","))
                .allowedHeaders("*")
                .allowedMethods("*")
                // allowCredentials(true): 表示附带身份凭证
                // 一旦使用 allowCredentials(true) 方法，则 allowedOrigins("*") 需要指明特定的域，而不能是 *
                .allowCredentials(true)
                .maxAge(86400);
    }
}
