package com.wenda.demo.models;

import com.wenda.demo.models.enums.ArticleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("articles")
@AllArgsConstructor
@Builder
@Data
public class Article {
    @Id
    private String id;

    private String title;
    private String content;

    private String ownerId;

    @Builder.Default
    private ArticleStatus status = ArticleStatus.DRAFT;

    @Builder.Default
    private Long upVote = 0L;
    @Builder.Default
    private Long downVote = 0L;
}
