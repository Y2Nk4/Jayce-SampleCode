package com.wenda.demo.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.models.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public class AnonymousAuthenticationToken extends AbstractAuthenticationToken {
    public AnonymousAuthenticationToken() {
        super(List.of(new SimpleGrantedAuthority(QARole.ROLE_ANONYMOUS.toString())));
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
}
