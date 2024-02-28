package com.wenda.demo.repositories;

import com.wenda.demo.models.Vote;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface VoteRepository extends MongoRepository<Vote, String> {
    @Query("{id:'?0'}")
    Vote findVoteById(String id);

    public long count();
}