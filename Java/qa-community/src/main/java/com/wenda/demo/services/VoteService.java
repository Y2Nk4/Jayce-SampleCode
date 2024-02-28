package com.wenda.demo.services;

import com.wenda.demo.controllers.exceptions.ContentNotFoundException;
import com.wenda.demo.controllers.exceptions.OperationNotAllowedException;
import com.wenda.demo.models.Answer;
import com.wenda.demo.models.Vote;
import com.wenda.demo.models.enums.AnswerStatus;
import com.wenda.demo.models.enums.ContentType;
import com.wenda.demo.models.enums.VoteType;
import com.wenda.demo.repositories.AnswerRepository;
import com.wenda.demo.repositories.VoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Component
@AllArgsConstructor
public class VoteService {
    @Autowired
    AnswerRepository answerRepository;
    @Autowired
    VoteRepository voteRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public Vote findVoteByContentAndUserId(ContentType contentType,
                                           String contentId,
                                           String userId) {
        Query query = new Query(
                Criteria.where("").andOperator(
                        Criteria.where("contentId").is(contentId),
                        Criteria.where("userId").is(userId),
                        Criteria.where("contentType").is(contentType)
                ));

        return mongoTemplate.findOne(query, Vote.class);
    }

    public Vote findVoteByAnswerAndUserId(String answerId, String userId) {
        return this.findVoteByContentAndUserId(ContentType.ANSWER, answerId, userId);
    }

    @Transactional
    public Vote voteAnswer(String answerId, VoteType voteType, String userId) throws ContentNotFoundException, OperationNotAllowedException {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ContentNotFoundException("Answer does not exists"));

        if (answer.getStatus() != AnswerStatus.PUBLIC) {
            throw new ContentNotFoundException("Answer does not exists");
        }
        if (Objects.equals(answer.getAnswererId(), userId)) {
            throw new OperationNotAllowedException("You cannot vote your answer");
        }

        Vote vote = this.findVoteByAnswerAndUserId(answerId, userId);
        Update answerUpdate = new Update();
        if (vote != null) {
            if (vote.getVoteType().equals(voteType)) {
                throw new OperationNotAllowedException("You had already up-voted this answer");
            } else {
                switch (voteType) {
                    case UP_VOTE -> {
                        answerUpdate.inc("upVote", 1);
                        answerUpdate.inc("downVote", -1);
                    }
                    case DOWN_VOTE -> {
                        answerUpdate.inc("upVote", -1);
                        answerUpdate.inc("downVote", 1);
                    }
                    default -> {
                        throw new OperationNotAllowedException("VoteType is illegal");
                    }
                }
            }
        } else {
            switch (voteType) {
                case UP_VOTE -> {
                    answerUpdate.inc("upVote", 1);
                }
                case DOWN_VOTE -> {
                    answerUpdate.inc("downVote", 1);
                }
                default -> {
                    throw new OperationNotAllowedException("VoteType is illegal");
                }
            }
        }

        mongoTemplate.findAndModify(
                new Query(Criteria.where("id").is(answerId)),
                answerUpdate,
                Answer.class);

        if (vote == null) {
            vote = voteRepository.save(
                    Vote.builder()
                        .contentId(answerId)
                        .contentType(ContentType.ANSWER)
                        .voteType(voteType)
                        .userId(userId)
                        .build());
        } else {
            vote = mongoTemplate.findAndModify(
                    new Query(Criteria.where("id").is(vote.getId())),
                    new Update().set("voteType", voteType),
                    Vote.class
            );
        }

        return vote;
    }
}
