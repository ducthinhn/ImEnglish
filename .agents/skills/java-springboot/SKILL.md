---
name: java-springboot
description: |
  Expert Java Spring Boot skill for ImEnglish backend. 
  Covers Spring Boot 3.x architecture, Spring Security JWT, WebSockets, 
  JPA/Hibernate with PostgreSQL, REST API design, and exception handling.
  Use this skill when writing backend Java code.
tags: [java, spring-boot, backend, rest-api, security]
---

# Java Spring Boot Skill for ImEnglish

## Architecture Pattern (Layered)
```
Controller (REST) 
  → Service (Business Logic) 
    → Repository (Data Access) 
      → Database (PostgreSQL / MongoDB)
```

## Standard Project Package Structure
```
com.imenglish
├── config/               # Spring configs (Security, CORS, OpenAPI)
├── controller/           # REST Controllers
│   ├── auth/
│   ├── user/
│   ├── ai/
│   └── p2p/
├── service/              # Business logic interfaces + impl
├── repository/           # JPA + MongoRepository interfaces
├── entity/               # JPA Entities (PostgreSQL)
├── document/             # MongoDB Documents
├── dto/                  # Request/Response DTOs
│   ├── request/
│   └── response/
├── mapper/               # MapStruct mappers
├── security/             # JWT filter, UserDetailsService
├── exception/            # Custom exceptions + GlobalExceptionHandler
├── event/                # Spring Events + Listeners
├── util/                 # Utility classes
└── ImEnglishApplication.java
```

## Standard API Response Wrapper
```java
@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private List<String> errors;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
            .success(true).data(data).timestamp(LocalDateTime.now()).build();
    }
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
            .success(false).message(message).timestamp(LocalDateTime.now()).build();
    }
}
```

## JWT Security Pattern
- Access token: 15 minutes
- Refresh token: 7 days (stored in HttpOnly cookie)
- Use `JwtAuthenticationFilter extends OncePerRequestFilter`
- Refresh token rotation on each use

## WebSocket Configuration
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
```

## Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(ApiResponse.error(ex.getMessage()));
    }
    // ... more handlers
}
```

## Maven Dependencies (pom.xml key deps)
```xml
<!-- Spring Boot Starters -->
<dependency>spring-boot-starter-web</dependency>
<dependency>spring-boot-starter-security</dependency>
<dependency>spring-boot-starter-data-jpa</dependency>
<dependency>spring-boot-starter-data-mongodb</dependency>
<dependency>spring-boot-starter-websocket</dependency>
<dependency>spring-boot-starter-validation</dependency>
<dependency>spring-boot-starter-actuator</dependency>

<!-- JWT -->
<dependency>io.jsonwebtoken:jjwt-api:0.12.x</dependency>

<!-- MapStruct -->
<dependency>org.mapstruct:mapstruct:1.6.x</dependency>

<!-- Flyway -->
<dependency>org.flywaydb:flyway-core</dependency>

<!-- OpenAPI -->
<dependency>org.springdoc:springdoc-openapi-starter-webmvc-ui:2.x</dependency>
```

## Common Rules
- Always annotate DTOs with `@Valid` at controller parameter level
- Use `@Slf4j` (Lombok) for logging, never `System.out.println`
- Use `Optional.orElseThrow()` consistently, never `get()` without check
- Pageable responses: return `Page<T>` from repository, map to DTOs
