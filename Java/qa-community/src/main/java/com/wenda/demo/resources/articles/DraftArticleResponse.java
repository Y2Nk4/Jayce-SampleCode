package com.wenda.demo.resources.articles;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DraftArticleResponse {
    private String title;
    private String content;
}
