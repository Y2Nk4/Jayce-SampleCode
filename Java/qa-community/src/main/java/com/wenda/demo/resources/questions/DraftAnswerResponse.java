package com.wenda.demo.resources.questions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DraftAnswerResponse {
    private String questionId;
    private String answerId;
}
