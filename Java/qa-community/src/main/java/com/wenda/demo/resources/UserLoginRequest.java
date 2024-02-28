package com.wenda.demo.resources;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserLoginRequest {
    private String username;
    private String password;
}
