package com.wenda.demo.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

@AllArgsConstructor
@Log4j2
public class MongoDBConfig extends AbstractMongoClientConfiguration {
    @Autowired
    private final Environment environment;

    @Bean
    private MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }

    @Override
    protected String getDatabaseName() {
        log.info("Mongo Config, DB: {}", environment.getProperty("spring.data.mongodb.database"));
        return environment.getProperty("spring.data.mongodb.database");
    }

    @Bean
    public MongoClient mongoClient() {
        String mongoDBServer = environment.getProperty("MONGODB_URL", "mongodb://localhost:27017");
        log.info("mongodb: {}", mongoDBServer);
        return MongoClients.create(mongoDBServer);
    }

    @Bean
    private MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, getDatabaseName());
    }
}
