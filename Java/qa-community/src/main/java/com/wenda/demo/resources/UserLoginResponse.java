package com.wenda.demo.resources;

import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Builder
public class UserLoginResponse {
    public String username;
    public String token;
}
