package com.wenda.demo.controllers.questions;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.wenda.demo.controllers.exceptions.ContentNotFoundException;
import com.wenda.demo.models.Answer;
import com.wenda.demo.models.Question;
import com.wenda.demo.models.enums.AnswerStatus;
import com.wenda.demo.models.enums.QuestionStatus;
import com.wenda.demo.repositories.AnswerRepository;
import com.wenda.demo.repositories.QuestionRepository;
import com.wenda.demo.resources.questions.DraftAnswerResponse;
import com.wenda.demo.resources.questions.NewDraftRequest;
import com.wenda.demo.resources.questions.PlainQuestionIdResponse;
import com.wenda.demo.resources.questions.UpdateDraftRequest;
import com.wenda.demo.response.ApiResponse;
import com.wenda.demo.services.AnswerService;
import com.wenda.demo.services.QuestionService;
import com.wenda.demo.utils.AuthenticationHelper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/question")
@PreAuthorize("hasAuthority('ROLE_USER')")
@Log4j2
public class QuestionController {
    QuestionRepository questionRepository;
    AnswerRepository answerRepository;
    AuthenticationHelper authenticationHelper;
    QuestionService questionService;
    AnswerService answerService;

    @PostMapping(path = "/newDraft", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ResponseBody
    public ResponseEntity<ApiResponse<PlainQuestionIdResponse>> createNewDraft(@ModelAttribute NewDraftRequest request){
        String title = request.getTitle();
        String description = request.getDescription();
        Assert.hasLength(title, "Title cannot be empty");
        Assert.hasLength(description, "Description cannot be empty");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = ((DecodedJWT)authentication.getCredentials()).getClaim("userId")
                                                                     .asString();

        Question question = Question.builder()
                .title(title)
                .description(description)
                .requesterId(userId)
                .status(QuestionStatus.DRAFT)
                .build();

        questionRepository.save(question);

        return ResponseEntity.ok(
                ApiResponse.<PlainQuestionIdResponse>builder()
                        .success(true)
                        .data(PlainQuestionIdResponse.builder()
                                              .id(question.getId())
                                              .build())
                        .build());
    }

    @PostMapping(path = "/{id}/publish")
    @ResponseBody
    public ResponseEntity<ApiResponse<PlainQuestionIdResponse>> publishQuestion(@PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Question Id cannot be empty");

        Question question = questionService.getQuestionById(id, true);

        log.info("Question status {}", question.getStatus());
        if (!question.getStatus().equals(QuestionStatus.DRAFT)) {
            throw new ContentNotFoundException("Question Not Found");
        }

        question.setStatus(QuestionStatus.PUBLIC);
        questionRepository.save(question);

        return ResponseEntity.ok(ApiResponse.<PlainQuestionIdResponse>builder()
                .success(true)
                .data(PlainQuestionIdResponse.builder()
                        .id(question.getId()).build())
                .build());
    }

    @PostMapping(path = "/{id}/update", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ResponseBody
    public ResponseEntity<ApiResponse<PlainQuestionIdResponse>> updateQuestion(
            @ModelAttribute UpdateDraftRequest request,
            @PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Question Id cannot be empty");
        log.info("Publishing Question {}", id);

        Question question = questionService.getQuestionById(id, true);
        String title = request.getTitle();
        if (StringUtils.hasLength(title)) {
            question.setTitle(title);
        }
        String description = request.getDescription();
        if (StringUtils.hasLength(description)) {
            question.setDescription(description);
        }

        questionRepository.save(question);

        return ResponseEntity.ok(ApiResponse.<PlainQuestionIdResponse>builder()
                .success(true)
                .data(PlainQuestionIdResponse.builder()
                        .id(question.getId()).build())
                .build());
    }

    @PostMapping(path = "/{id}/draftAnswer")
    @ResponseBody
    public ResponseEntity<ApiResponse<DraftAnswerResponse>> draftAnswer(
            @ModelAttribute UpdateDraftRequest request,
            @PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Question Id cannot be empty");
        log.info("Publishing Question {}", id);

        Answer answer = answerRepository.findAnswersByQuestionIdAndAnswererId(
                id, authenticationHelper.getLoggedUser().getId()
        );
        if (answer != null) {
            return ResponseEntity.ok(ApiResponse.<DraftAnswerResponse>builder()
                            .success(true)
                            .data(DraftAnswerResponse.builder()
                                    .answerId(answer.getId())
                                    .questionId(answer.getQuestionId())
                                    .build())
                            .build());
        }

        Question question = questionService.getQuestionById(id, false);

        answer = Answer.builder()
                .questionId(question.getId())
                .answererId(authenticationHelper.getLoggedUser().getId())
                .status(AnswerStatus.DRAFT)
                .build();

        answerRepository.save(answer);
        return ResponseEntity.ok(ApiResponse.<DraftAnswerResponse>builder()
                .success(true)
                .data(DraftAnswerResponse.builder()
                        .answerId(answer.getId())
                        .questionId(answer.getQuestionId())
                        .build())
                .build());
    }

    @GetMapping(path = "/{id}/answers")
    @ResponseBody
    @PreAuthorize("hasAuthority('ROLE_ANONYMOUS')")
    public ResponseEntity<ApiResponse<List<Answer>>> getAllAnswers(
            @ModelAttribute UpdateDraftRequest request,
            @PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Question Id cannot be empty");
        log.info("Publishing Question {}", id);

        List<Answer> answers = answerService.findAllPublicAnswersByQuestionId(id);

        return ResponseEntity.ok(ApiResponse.<List<Answer>>builder()
                .success(true)
                .data(answers)
                .build());
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('ROLE_ANONYMOUS')")
    public ResponseEntity<ApiResponse<Question>> getQuestion(
            @ModelAttribute UpdateDraftRequest request,
            @PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Question Id cannot be empty");
        log.info("Publishing Question {}", id);

        Question question = questionRepository.findQuestionById(id);

        return ResponseEntity.ok(ApiResponse.<Question>builder()
                .success(true)
                .data(question)
                .build());
    }
}
