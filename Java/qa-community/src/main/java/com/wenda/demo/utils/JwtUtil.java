package com.wenda.demo.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.models.User;
import com.wenda.demo.repositories.UserRepository;
import com.wenda.demo.security.JwtAuthenticationToken;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.util.Date;
import java.util.UUID;
@Log4j2
@Component
public class JwtUtil {
    private final static Long EXPIRED_AFTER = 1000L * 60 * 60 * 24 * 30;
    private final JWTVerifier jwtVerifier;
    private final UserRepository userRepository;
    private final Algorithm algorithm;
    private final Environment environment;

    public JwtUtil(@Autowired Environment environment, @Autowired UserRepository userRepository) {
        this.environment = environment;
        this.userRepository = userRepository;
        String jwtKey = this.environment.getProperty("jwt-key");
        Assert.notNull(jwtKey, "JWT Key is not Set");
        algorithm = Algorithm.HMAC256(jwtKey);
        jwtVerifier = JWT.require(algorithm).build();
    }

    public Authentication getAuthentication(String token) {
        DecodedJWT decodedJWT = jwtVerifier.verify(token);

        String userId = decodedJWT.getClaim("userId").asString();
        User user = userRepository.findUserById(userId);

        return new JwtAuthenticationToken(user, decodedJWT);
    }

    public boolean validateToken(String token) {
        try {
            DecodedJWT decodedJWT = jwtVerifier.verify(token);
        } catch (JWTVerificationException e) {
            System.out.println(e.getMessage());
            return false;
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public String signToken(User user) {
        return JWT.create()
                .withIssuer(environment.getProperty("jwt-issuer"))
                .withSubject(user.getUsername())
                .withClaim("userId", user.getId())
                .withClaim("role", "USER")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRED_AFTER))
                .withJWTId(UUID.randomUUID().toString())
                .withNotBefore(new Date(System.currentTimeMillis() + 1000L))
                .sign(algorithm);
    }
}
