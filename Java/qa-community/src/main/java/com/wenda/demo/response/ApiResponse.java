package com.wenda.demo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T>{
    private T data;
    private boolean success;
    private String error;
}
