package com.wenda.demo.services;

import com.wenda.demo.models.Question;
import com.wenda.demo.models.User;
import com.wenda.demo.models.enums.QuestionStatus;
import com.wenda.demo.repositories.QuestionRepository;
import com.wenda.demo.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    MongoTemplate mongoTemplate;

    public boolean checkIfUsernameOrEmailExists(String username, String email) {
        // potential performance issue:
        //  count will perform a full table scan
        //  when the table is large, it will be slow
        //  solution: use email and username as index/partition key
        Query query = new Query();
        query.addCriteria(Criteria.where("").orOperator(
                Criteria.where("username").is(username),
                Criteria.where("email").is(email)
        ));

        return mongoTemplate.count(query, User.class) > 0;
    }
}
