package com.wenda.demo.controllers.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class ApiBaseException extends Exception {
    @Getter
    private String message;

    @Getter
    private HttpStatusCode statusCode;
}