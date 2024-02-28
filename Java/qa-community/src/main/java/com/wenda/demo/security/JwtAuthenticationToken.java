package com.wenda.demo.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.models.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {
    private final DecodedJWT decodedJWT;
    private final User user;

    public JwtAuthenticationToken(User user, DecodedJWT decodedJWT) {
        super(user.getRoles().stream().map(SimpleGrantedAuthority::new).toList());
        this.user = user;
        this.decodedJWT = decodedJWT;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return decodedJWT;
    }

    @Override
    public Object getPrincipal() {
        return user;
    }
}
