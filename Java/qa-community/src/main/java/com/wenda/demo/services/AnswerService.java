package com.wenda.demo.services;

import com.wenda.demo.models.Answer;
import com.wenda.demo.models.enums.AnswerStatus;
import com.wenda.demo.repositories.AnswerRepository;
import com.wenda.demo.utils.AuthenticationHelper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class AnswerService {
    @Autowired
    AnswerRepository answerRepository;
    @Autowired
    MongoTemplate mongoTemplate;
    @Autowired
    AuthenticationHelper authenticationHelper;

    public List<Answer> findAllPublicAnswersByQuestionId(String questionId) {
        String loggedInUserId = authenticationHelper.getLoggedUserId();
        Query query = new Query();
        query.addCriteria(Criteria.where("").orOperator(
                Criteria.where("answererId").is(loggedInUserId),
                Criteria.where("status").is(AnswerStatus.PUBLIC)
        ));
        query.addCriteria(Criteria.where("questionId").is(questionId));
        return mongoTemplate.find(query, Answer.class);
    }

    public Answer findAnswerByIdAndUserId(String answerId, String userId) {
        return answerRepository.findAnswerByIdAndUserId(answerId, userId);
    }
}
