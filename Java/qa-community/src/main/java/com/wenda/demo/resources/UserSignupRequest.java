package com.wenda.demo.resources;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserSignupRequest {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;

    private String name;
}
