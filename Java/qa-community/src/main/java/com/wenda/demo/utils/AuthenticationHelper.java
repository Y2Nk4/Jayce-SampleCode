package com.wenda.demo.utils;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.models.User;
import com.wenda.demo.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AuthenticationHelper {
    @Autowired
    private UserRepository userRepository;

    public User getLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getCredentials() == null) {
            return null;
        }

        String userId = ((DecodedJWT) authentication.getCredentials())
                                    .getClaim("userId")
                                    .asString();

        return userRepository.findUserById(userId);
    }

    public String getLoggedUserId() {
        User user = getLoggedUser();
        if (user == null) {
            return null;
        } else {
            return user.getId();
        }
    }
}
