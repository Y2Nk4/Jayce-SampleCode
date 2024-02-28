package com.wenda.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({
        SecurityConfiguration.class,
        MongoDBConfig.class,
        SpringConfiguration.class,
        CorsConfiguration.class
})
public class AppConfig {
}
