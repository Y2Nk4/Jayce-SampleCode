package com.wenda.demo.controllers.articles;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.controllers.exceptions.ContentNotFoundException;
import com.wenda.demo.models.Article;
import com.wenda.demo.models.Question;
import com.wenda.demo.models.enums.ArticleStatus;
import com.wenda.demo.models.enums.QuestionStatus;
import com.wenda.demo.repositories.ArticleRepository;
import com.wenda.demo.resources.articles.DraftArticleResponse;
import com.wenda.demo.resources.questions.NewDraftRequest;
import com.wenda.demo.resources.questions.PlainQuestionIdResponse;
import com.wenda.demo.response.ApiResponse;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/article")
@PreAuthorize("hasAuthority('ROLE_USER')")
@AllArgsConstructor
@Log4j2
public class ArticleController {
    private ArticleRepository articleRepository;

    @GetMapping(path = "/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('ROLE_ANONYMOUS')")
    public ResponseEntity<ApiResponse<Article>> getArticle(@PathVariable String id)
            throws ContentNotFoundException {
        Assert.hasLength(id, "Article Id cannot be empty");
        log.info("Publishing Question {}", id);

        Article article = articleRepository.findArticleById(id);

        return ResponseEntity.ok(ApiResponse.<Article>builder()
                .success(true)
                .data(article)
                .build());
    }

    @PostMapping(path = "/newDraft", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ResponseBody
    public ResponseEntity<ApiResponse<PlainQuestionIdResponse>> createNewDraft(@ModelAttribute DraftArticleResponse request){
        String title = request.getTitle();
        String content = request.getContent();
        Assert.hasLength(title, "Title cannot be empty");
        Assert.hasLength(content, "Content cannot be empty");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = ((DecodedJWT)authentication.getCredentials()).getClaim("userId")
                .asString();

        Article article = Article.builder()
                .title(title)
                .content(content)
                .ownerId(userId)
                .status(ArticleStatus.DRAFT)
                .build();

        articleRepository.save(article);

        return ResponseEntity.ok(
                ApiResponse.<PlainQuestionIdResponse>builder()
                        .success(true)
                        .data(PlainQuestionIdResponse.builder()
                                .id(article.getId())
                                .build())
                        .build());
    }
}
