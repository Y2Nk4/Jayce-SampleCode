package com.wenda.demo.resources.answers;

import com.wenda.demo.models.enums.VoteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class VoteAnswerRequest {
    private VoteType voteType;
}
