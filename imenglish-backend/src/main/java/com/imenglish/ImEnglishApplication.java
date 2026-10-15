package com.imenglish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ImEnglishApplication {

    public static void main(String[] args) {
        SpringApplication.run(ImEnglishApplication.class, args);
    }
}
