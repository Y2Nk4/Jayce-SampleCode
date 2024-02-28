package com.wenda.demo.controllers.exceptions;

import com.mongodb.lang.Nullable;
import com.wenda.demo.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.nio.file.AccessDeniedException;


@ControllerAdvice
@Log4j2
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Provides handling for exceptions throughout this service.
     *
     * @param ex The target exception
     * @param request The current request
     */
    @ExceptionHandler({
            LoginInvalidPasswordException.class,
            Exception.class
    })
    @Nullable
    public final ResponseEntity<ApiResponse> handleException(Exception ex, HttpServletRequest request) {
        log.error("Handling " + ex.getClass().getSimpleName() + " due to " + ex.getMessage());
        log.error("Request: " + request.getRequestURL() + " raised " + ex);

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = ex.getMessage();
        // special
        if (ex instanceof ApiBaseException apiException) {
            return handleApiException(apiException.getMessage(), apiException.getStatusCode(), request);
        } else if (ex instanceof IllegalArgumentException) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (ex instanceof InsufficientAuthenticationException || ex instanceof AccessDeniedException) {
            status = HttpStatus.UNAUTHORIZED;
            message = "Unauthorized Access";
        }
        if (log.isWarnEnabled()) {
            log.warn("Unknown exception type: " + ex.getClass().getName());
        }

        return handleApiException(message, status, request);
    }

    protected ResponseEntity<ApiResponse> handleApiException(String message, HttpStatusCode statusCode, HttpServletRequest req) {
        return ResponseEntity.status(statusCode).body(
                ApiResponse.builder()
                        .success(false)
                        .error(message)
                        .build()
        );
    }
}