package com.wenda.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("users")
@AllArgsConstructor
@Builder
@Data
public class User {

    @Id
    private String id;

    public String username;

    @JsonIgnore
    private String password;

    public String email;
    public String name;

    @JsonIgnore
    public List<String> roles;
}