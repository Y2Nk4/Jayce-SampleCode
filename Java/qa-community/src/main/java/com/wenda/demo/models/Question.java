package com.wenda.demo.models;

import com.wenda.demo.models.enums.QuestionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("questions")
@AllArgsConstructor
@Builder
@Data
public class Question {
    @Id
    private String id;
    private String title;
    private String description;
    private QuestionStatus status;

    private String requesterId;
}
