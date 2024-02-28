package com.wenda.demo.controllers.questions;

import com.wenda.demo.controllers.exceptions.ContentNotFoundException;
import com.wenda.demo.controllers.exceptions.OperationNotAllowedException;
import com.wenda.demo.models.Answer;
import com.wenda.demo.models.Vote;
import com.wenda.demo.models.enums.AnswerStatus;
import com.wenda.demo.repositories.AnswerRepository;
import com.wenda.demo.resources.answers.UpdateAnswerRequest;
import com.wenda.demo.resources.answers.VoteAnswerRequest;
import com.wenda.demo.response.ApiResponse;
import com.wenda.demo.services.AnswerService;
import com.wenda.demo.services.VoteService;
import com.wenda.demo.utils.AuthenticationHelper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/answer")
@PreAuthorize("hasAuthority('ROLE_USER')")
@AllArgsConstructor
@Log4j2
public class AnswerController {
    private final AnswerRepository answerRepository;
    private final AuthenticationHelper authenticationHelper;
    private final AnswerService answerService;
    private final VoteService voteService;


    @PostMapping(path = "/{id}/update")
    @ResponseBody
    public ResponseEntity<ApiResponse<Answer>> updateAnswer(
            @ModelAttribute UpdateAnswerRequest request,
            @PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Answer Id cannot be empty");
        log.info("Answer {}", id);

        String userId = authenticationHelper.getLoggedUserId();
        Answer answer = answerService.findAnswerByIdAndUserId(id, userId);
        if (answer == null) {
            throw new ContentNotFoundException("Answer does not exist");
        }

        answer.setContent(request.getContent());
        answerRepository.save(answer);

        return ResponseEntity.ok(ApiResponse.<Answer>builder()
                .success(true)
                .data(answer)
                .build());
    }

    @PostMapping(path = "/{id}/publish")
    @ResponseBody
    public ResponseEntity<ApiResponse<Answer>> publishAnswer(
            @PathVariable String id) throws ContentNotFoundException, OperationNotAllowedException {
        Assert.hasLength(id, "Answer Id cannot be empty");
        log.info("Answer {}", id);

        String userId = authenticationHelper.getLoggedUserId();
        Answer answer = answerService.findAnswerByIdAndUserId(id, userId);
        if (answer == null) {
            throw new ContentNotFoundException("Answer does not exist");
        }
        if (answer.getStatus() != AnswerStatus.DRAFT) {
            throw new OperationNotAllowedException("You can only publish a draft answer");
        }
        if (!StringUtils.hasLength(answer.getContent())) {
            throw new OperationNotAllowedException("You cannot publish answer with no content");
        }

        answer.setStatus(AnswerStatus.PUBLIC);
        answerRepository.save(answer);

        return ResponseEntity.ok(ApiResponse.<Answer>builder()
                .success(true)
                .data(answer)
                .build());
    }

    @PostMapping(path = "/{id}/vote")
    @ResponseBody
    public ResponseEntity<ApiResponse<?>> voteAnswer(
            @ModelAttribute VoteAnswerRequest request,
            @PathVariable String id) throws ContentNotFoundException {
        Assert.hasLength(id, "Answer Id cannot be empty");
        log.info("Answer {}", id);

        String userId = authenticationHelper.getLoggedUserId();
        Answer answer = answerService.findAnswerByIdAndUserId(id, userId);
        if (answer == null) {
            throw new ContentNotFoundException("Answer does not exist");
        }

        try {
            Vote vote = voteService.voteAnswer(answer.getId(), request.getVoteType(), userId);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .build());
        } catch (Exception exception) {
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(false)
                    .error(exception.getMessage())
                    .build());
        }
    }
}
