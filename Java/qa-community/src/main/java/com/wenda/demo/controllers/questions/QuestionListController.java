package com.wenda.demo.controllers.questions;

import com.wenda.demo.models.Question;
import com.wenda.demo.models.enums.QuestionStatus;
import com.wenda.demo.repositories.AnswerRepository;
import com.wenda.demo.repositories.QuestionRepository;
import com.wenda.demo.response.ApiResponse;
import com.wenda.demo.services.AnswerService;
import com.wenda.demo.services.QuestionService;
import com.wenda.demo.utils.AuthenticationHelper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Question List")
@AllArgsConstructor
@RestController
@RequestMapping("/questions")
@PreAuthorize("hasAuthority('ROLE_USER')")
@Log4j2
public class QuestionListController {
    QuestionRepository questionRepository;
    AnswerRepository answerRepository;
    AuthenticationHelper authenticationHelper;
    QuestionService questionService;
    AnswerService answerService;


    @Operation(summary = "Get Latest Question List", method = "GET")
    @GetMapping(path = "/latest")
    @ResponseBody
    @PreAuthorize("hasAuthority('ROLE_ANONYMOUS')")
    public ResponseEntity<ApiResponse<List<Question>>> getLatestQuestionsList(){
        List<Question> questions = questionService.findQuestionsByStatus(QuestionStatus.PUBLIC);

        return ResponseEntity.ok(
                ApiResponse.<List<Question>>builder()
                        .success(true)
                        .data(questions)
                        .build());
    }
}
