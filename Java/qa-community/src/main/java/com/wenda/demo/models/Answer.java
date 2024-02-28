package com.wenda.demo.models;

import com.wenda.demo.models.enums.AnswerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("answers")
@AllArgsConstructor
@Builder
@Data
public class Answer {
    @Id
    private String id;
    private String content;
    private String answererId;
    private String questionId;

    @Builder.Default
    private AnswerStatus status = AnswerStatus.DRAFT;

    @Builder.Default
    private Long upVote = 0L;
    @Builder.Default
    private Long downVote = 0L;
}
