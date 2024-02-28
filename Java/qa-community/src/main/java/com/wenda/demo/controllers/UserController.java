package com.wenda.demo.controllers;

import com.wenda.demo.models.User;
import com.wenda.demo.repositories.UserRepository;
import com.wenda.demo.resources.UserProfileUpdateRequest;
import com.wenda.demo.response.ApiResponse;
import com.wenda.demo.services.AuthService;
import com.wenda.demo.utils.AuthenticationHelper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User Related")
@RestController
@RequestMapping("/user")
@PreAuthorize("hasAuthority('ROLE_USER')")
@AllArgsConstructor
@Log4j2
public class UserController {
    private final AuthenticationHelper authenticationHelper;
    private final UserRepository userRepository;

    @Operation(summary = "Get User Info by user id", method = "GET")
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable String id) {
        User user = userRepository.findItemByUsername(id);
        if (user == null) {
            user = userRepository.findUserById(id);
        }

        return ResponseEntity.ok(
                ApiResponse.<User>builder()
                        .success(user != null)
                        .data(user)
                        .build());
    }

    @Operation(summary = "Update user profile info", method = "POST")
    @PostMapping(path = "/profile/edit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ResponseBody
    public ResponseEntity<ApiResponse<User>> updateUserProfile(@ModelAttribute UserProfileUpdateRequest request) {
        String userId = authenticationHelper.getLoggedUserId();
        User user = userRepository.findUserById(userId);
        if (user == null) {
            return ResponseEntity.ok(
                    ApiResponse.<User>builder()
                            .success(false)
                            .error("User not found")
                            .build());
        }
        user.name = request.name;

        userRepository.save(user);

        return ResponseEntity.ok(
                ApiResponse.<User>builder()
                        .success(true)
                        .data(user)
                        .build());
    }
}
