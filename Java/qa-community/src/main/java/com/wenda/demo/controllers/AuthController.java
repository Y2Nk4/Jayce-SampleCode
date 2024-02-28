package com.wenda.demo.controllers;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.controllers.exceptions.LoginInvalidPasswordException;
import com.wenda.demo.models.User;
import com.wenda.demo.repositories.UserRepository;
import com.wenda.demo.resources.UserLoginRequest;
import com.wenda.demo.resources.UserLoginResponse;
import com.wenda.demo.resources.UserSignupRequest;
import com.wenda.demo.response.ApiResponse;
import com.wenda.demo.security.QARole;
import com.wenda.demo.services.AuthService;
import com.wenda.demo.utils.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Authentication")
@RestController
@RequestMapping("/auth")
@PreAuthorize("hasAuthority('ROLE_ANONYMOUS')")
@AllArgsConstructor
@Log4j2
class AuthController {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Operation(summary = "Check Current Logged User", method = "GET")
    @GetMapping("/loggedUser")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<ApiResponse<User>> getLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        DecodedJWT decodedJWT = (DecodedJWT)authentication.getCredentials();
        String userId = decodedJWT.getClaim("userId").asString();
        log.info("username: {}", userId);

        User user = userRepository.findUserById(userId);

        return ResponseEntity.ok(
                ApiResponse.<User>builder()
                        .success(user != null)
                        .data(user)
                .build());
    }

    @Operation(summary = "User Signup", method = "POST")
    @PostMapping(path = "/signup", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<?>> signup(@ModelAttribute UserSignupRequest request) {
        String username = request.getUsername();
        String name = request.getName();
        String inputPassword = request.getPassword();
        String email = request.getEmail();
        String confirmPassword = request.getConfirmPassword();
        Assert.hasLength(username, "Username cannot be Empty");
        Assert.hasLength(inputPassword, "Password cannot be Empty");
        Assert.hasLength(confirmPassword, "Confirm Password cannot be Empty");
        Assert.hasLength(email, "Email cannot be Empty");
        Assert.hasLength(name, "Name cannot be Empty");
        Assert.isTrue(inputPassword.equals(confirmPassword),
                "confirm password does not match with password");

        if (authService.checkIfUsernameOrEmailExists(username, email)) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .error("Username or Email already exists")
                    .build());
        }

        User user = User.builder()
                .username(username)
                .name(name)
                .password(BCrypt.hashpw(inputPassword, BCrypt.gensalt()))
                .email(email)
                .roles(List.of(
                        QARole.ROLE_USER.toString(),
                        QARole.ROLE_ANONYMOUS.toString()))
                .build();
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .build());
    }


    @Operation(summary = "User Login", method = "POST")
    @PostMapping(path = "/login", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<UserLoginResponse>> login(@ModelAttribute UserLoginRequest request)
            throws LoginInvalidPasswordException {
        String username = request.getUsername();
        String inputPassword = request.getPassword();
        Assert.hasLength(username, "Username cannot be Empty");
        Assert.hasLength(inputPassword, "Password cannot be Empty");

        User user = userRepository.findItemByUsername(username);

        if(user == null) {
            throw new LoginInvalidPasswordException();
        }
        if (!BCrypt.checkpw(inputPassword, user.getPassword())) {
            throw new LoginInvalidPasswordException();
        }

        String userToken = jwtUtil.signToken(user);

        return ResponseEntity.ok(ApiResponse.<UserLoginResponse>builder()
                        .success(true)
                        .data(UserLoginResponse.builder()
                                .username(user.getUsername())
                                .token(userToken)
                                .build())
                        .build());
    }
}
