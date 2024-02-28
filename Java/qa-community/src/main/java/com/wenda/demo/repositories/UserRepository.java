package com.wenda.demo.repositories;


import com.wenda.demo.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    @Query("{username:'?0'}")
    User findItemByUsername(String username);

    @Query(value="{username:'?0'}", fields="{'username' : 1}")
    List<User> findAll(String username);

    public long count();

    @Query("{id: '?0'}")
    User findUserById(String id);
}