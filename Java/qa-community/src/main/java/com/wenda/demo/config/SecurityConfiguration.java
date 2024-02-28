package com.wenda.demo.config;

import com.wenda.demo.controllers.exceptions.JwtAuthenticationEntryPoint;
import com.wenda.demo.security.JwtAuthenticationFilter;
import com.wenda.demo.security.QARole;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;


import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for the main application.
 *
 * @author Josh Cummings
 */
@AllArgsConstructor
@EnableMethodSecurity
@Log4j2
public class SecurityConfiguration {
    @Autowired
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Autowired
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("configure ran");
        http.csrf(csrf -> csrf.disable());
        http.httpBasic(httpBasic -> httpBasic.disable());

//        http.authorizeHttpRequests(authorize -> authorize
//                .requestMatchers("/public/**",
//                        "/auth/login",
//                        "/auth/signup").permitAll()
//                .anyRequest().hasAuthority(QARole.ROLE_USER.toString()));

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        http.exceptionHandling(exceptionHandling -> {
            exceptionHandling.authenticationEntryPoint(jwtAuthenticationEntryPoint);
        });

        return http.build();
    }
}