package com.wenda.demo.services.datamodels;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VoteAnswerResult {
    boolean success;
    String error;
}
