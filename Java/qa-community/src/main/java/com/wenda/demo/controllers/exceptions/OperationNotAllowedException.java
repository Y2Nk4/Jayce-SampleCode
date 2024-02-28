package com.wenda.demo.controllers.exceptions;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Builder
public class OperationNotAllowedException extends ApiBaseException {
    @Getter
    private String message = "Operation Not Allowed";

    public OperationNotAllowedException() {}
    public OperationNotAllowedException(String message) {
        this.message = message;
    }

    @Getter
    private final HttpStatusCode statusCode = HttpStatus.FORBIDDEN;
}