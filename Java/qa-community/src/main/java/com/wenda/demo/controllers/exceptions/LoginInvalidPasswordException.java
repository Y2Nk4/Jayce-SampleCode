package com.wenda.demo.controllers.exceptions;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class LoginInvalidPasswordException extends ApiBaseException {
    @Getter
    private final String message = "Username does not match with the Password";

    @Getter
    private final HttpStatusCode statusCode = HttpStatus.OK;
}