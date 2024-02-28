package com.wenda.demo.repositories;


import com.wenda.demo.models.Question;
import com.wenda.demo.models.enums.QuestionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {

    @Query("{id:'?0'}")
    Question findQuestionById(String id);

    @Query("{id:'?0', 'requesterId': '?1'}")
    Question findQuestionByIdAndRequesterId(String id, String requesterId);

    @Query(value="{title:'?0'}", fields="{'id' : 1}")
    List<Question> findByTitle(String title);

    public long count();
}