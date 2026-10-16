package com.imenglish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableMongoAuditing
@EnableJpaRepositories(basePackages = "com.imenglish.repository")
@EnableMongoRepositories(basePackages = "com.imenglish.ai.repository")
public class ImEnglishApplication {

    public static void main(String[] args) {
        SpringApplication.run(ImEnglishApplication.class, args);
    }
}
