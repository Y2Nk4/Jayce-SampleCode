package com.wenda.demo.repositories;

import com.wenda.demo.models.Article;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ArticleRepository extends MongoRepository<Article, String> {

    @Query("{id:'?0'}")
    Article findArticleById(String id);

    public long count();
}