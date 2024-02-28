package com.wenda.demo.resources.answers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UpdateAnswerRequest {
    private String content;
}
