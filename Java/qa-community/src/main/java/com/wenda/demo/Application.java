package com.wenda.demo;

import com.wenda.demo.repositories.UserRepository;
import com.wenda.demo.services.AuthService;
import com.wenda.demo.utils.JwtUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
@EnableMongoRepositories
@Log4j2
public class Application {
	@Autowired
	UserRepository userRepository;
	@Autowired
	AuthService authService;

	public static void main(String[] args) {
		// SpringApplication.run(Application.class, args);
		new SpringApplicationBuilder()
				.profiles("dev") // and so does this
				.sources(Application.class)
				.run(args);
	}

	@Bean
	WebMvcConfigurer createWebMvcConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				// 映射路径`/static/`到classpath路径:
				registry.addResourceHandler("/static/**")
						.addResourceLocations("classpath:/static/");
			}
		};
	}
}
