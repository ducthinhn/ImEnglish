---
name: project-workflow
description: |
  Complete development workflow for ImEnglish project. Covers git branching,
  API development cycle, testing strategy, AI session testing, WebRTC testing,
  and deployment pipeline steps.
tags: [workflow, git, testing, deployment, ci-cd]
---

# ImEnglish Development Workflow

## Git Branching Strategy (GitHub Flow)
```
main (production-ready)
  └── develop (integration branch)
        ├── feature/UC08-ai-roleplay-session
        ├── feature/UC13-p2p-voice-call
        ├── fix/jwt-refresh-token-bug
        └── chore/add-flyway-migration
```

### Branch Naming Convention
- `feature/UC{id}-short-description` — New feature
- `fix/short-description` — Bug fix
- `chore/short-description` — Config, refactoring
- `hotfix/short-description` — Emergency production fix

### PR Checklist
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Swagger docs updated
- [ ] No hardcoded secrets
- [ ] Flyway migration added (if schema changed)
- [ ] API response format follows ApiResponse<T> wrapper

## Backend Development Cycle

### 1. New Feature Flow
```bash
git checkout -b feature/UC08-ai-roleplay

# 1. Add Flyway migration (if DB change)
# Create: resources/db/migration/V{n}__{description}.sql

# 2. Create/update Entity or MongoDB Document

# 3. Create Repository interface

# 4. Create DTOs (Request + Response)

# 5. Create MapStruct Mapper

# 6. Implement Service (interface + impl)

# 7. Write unit tests for Service

# 8. Create Controller with Swagger annotations

# 9. Write integration test (Spring Boot Test + TestContainers)

# 10. Test manually via Swagger UI: http://localhost:8080/swagger-ui.html
```

### 2. Local Development Setup
```bash
# Start all services
docker-compose up -d

# Run Spring Boot
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Services running:
# Backend:    http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
# PostgreSQL: localhost:5432
# MongoDB:    localhost:27017
# Redis:      localhost:6379
```

### 3. Docker Compose (local dev)
```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: imenglish_db
      POSTGRES_USER: imenglish
      POSTGRES_PASSWORD: local_password
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  coturn:
    image: coturn/coturn
    ports: ["3478:3478/udp", "3478:3478/tcp"]
    command: ["-n", "--log-file=stdout", "--min-port=49160", "--max-port=49200"]
```

## Testing Strategy

### Unit Tests (JUnit 5 + Mockito)
```java
@ExtendWith(MockitoExtension.class)
class AiSessionServiceTest {
    @Mock AiSessionRepository aiSessionRepository;
    @Mock ConversationRepository conversationRepository;
    @Mock GenAiClient genAiClient;
    
    @InjectMocks AiSessionServiceImpl aiSessionService;
    
    @Test
    void shouldCreateAiSession_whenValidRequest() { ... }
    
    @Test
    void shouldThrowException_whenUserNotFound() { ... }
}
```

### Integration Tests (TestContainers)
```java
@SpringBootTest
@Testcontainers
class P2PMatchingIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
    
    @Container
    static MongoDBContainer mongo = new MongoDBContainer("mongo:7");
    
    // Real DB interactions
}
```

### WebRTC Testing
- Use `chrome://webrtc-internals` for connection debugging
- Test NAT traversal with TURN server enabled
- Test with 2 different network environments (use ngrok for local testing)

### AI Session Testing
```bash
# Test AI response endpoint
curl -X POST http://localhost:8080/api/v1/ai/sessions/{id}/message \
  -H "Authorization: Bearer {jwt}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, how are you?"}'
```

## CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: {POSTGRES_DB: test_db, POSTGRES_PASSWORD: test}
      mongo:
        image: mongo:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: {java-version: '21'}
      - run: ./mvnw test
      - run: ./mvnw package -DskipTests
  
  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          docker build -t imenglish-backend .
          docker push registry/imenglish-backend:staging
          # SSH and docker-compose up on staging server
```

## Environment Variables Template
```env
# .env.example (commit this, not .env!)

# Database
POSTGRES_URL=jdbc:postgresql://localhost:5432/imenglish_db
POSTGRES_USERNAME=imenglish
POSTGRES_PASSWORD=your_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/imenglish

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_very_long_secret_key_minimum_256_bits
JWT_ACCESS_EXPIRY_MINUTES=15
JWT_REFRESH_EXPIRY_DAYS=7

# AI APIs
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
GCP_PROJECT_ID=your-project-id

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=imenglish-audio
AWS_REGION=ap-southeast-1

# TURN Server
TURN_URL=turn:your-coturn.com:3478
TURN_USERNAME=user
TURN_PASSWORD=password

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_URL=http://localhost:8080/ws
```
