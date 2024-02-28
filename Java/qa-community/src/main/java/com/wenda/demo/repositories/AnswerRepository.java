package com.wenda.demo.repositories;


import com.wenda.demo.models.Answer;
import com.wenda.demo.models.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface AnswerRepository extends MongoRepository<Answer, String> {

    @Query("{questionId:'?0'}")
    List<Answer> findAnswersByQuestionId(String questionId);

    @Query("{questionId:'?0', answererId:  '?1'}")
    Answer findAnswersByQuestionIdAndAnswererId(String questionId, String userId);
    @Query("{id:'?0', answererId:  '?1'}")
    Answer findAnswerByIdAndUserId(String answerId, String userId);

    @Query("{id:'?0', 'requesterId': '?1'}")
    Question findAnswerById(String id, String requesterId);

    public long count();
}