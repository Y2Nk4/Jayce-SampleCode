package com.wenda.demo.services;

import com.wenda.demo.controllers.exceptions.ContentNotFoundException;
import com.wenda.demo.models.Answer;
import com.wenda.demo.models.Question;
import com.wenda.demo.models.User;
import com.wenda.demo.models.enums.AnswerStatus;
import com.wenda.demo.models.enums.QuestionStatus;
import com.wenda.demo.repositories.QuestionRepository;
import com.wenda.demo.utils.AuthenticationHelper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class QuestionService {
    @Autowired
    QuestionRepository questionRepository;
    @Autowired
    AuthenticationHelper authenticationHelper;
    @Autowired
    MongoTemplate mongoTemplate;

    public Optional<Question> findPublicQuestionById(String questionId) {
        return questionRepository.findOne(
                Example.of(Question.builder()
                        .id(questionId)
                        .status(QuestionStatus.PUBLIC)
                        .build()));
    }

    public List<Question> findQuestionsByStatus(QuestionStatus status) {
        Query query = new Query();
        query.addCriteria(Criteria.where("").orOperator(
                Criteria.where("status").is(status)
        ));;
        return mongoTemplate.find(query, Question.class);
    }

    public Question getQuestionById(String questionId, Boolean onlyAuthor) throws ContentNotFoundException {
        User loggedInUser = authenticationHelper.getLoggedUser();
        String userId = null;
        if (loggedInUser != null) {
            userId = loggedInUser.getId();
        }
        Question question;

        question = questionRepository.findQuestionByIdAndRequesterId(
                questionId, userId);

        // if it's not for onlyAuthor, then
        // it also returns the available public question
        if (!onlyAuthor && question == null) {
            question = findPublicQuestionById(questionId).orElse(null);
        }

        if (question == null) {
            throw new ContentNotFoundException("Question Not Found");
        }

        return question;
    }
}
