package com.wenda.demo.controllers.exceptions;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Builder
public class ContentNotFoundException extends ApiBaseException {
    @Getter
    private String message = "Content Not Found";

    public ContentNotFoundException() {}
    public ContentNotFoundException(String message) {
        this.message = message;
    }

    @Getter
    private final HttpStatusCode statusCode = HttpStatus.NOT_FOUND;
}