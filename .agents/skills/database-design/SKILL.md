---
name: database-design
description: |
  Database design skill for ImEnglish dual-database architecture.
  PostgreSQL for relational data (users, friendships, sessions) and
  MongoDB for unstructured AI data (conversations, memories, scenarios).
  Includes Flyway migrations, indexing strategy, and query patterns.
tags: [postgresql, mongodb, database, flyway, schema]
---

# Database Design Skill for ImEnglish

## Dual Database Strategy
| Data Type | Database | Reason |
|-----------|----------|--------|
| Users, Auth, Profiles | PostgreSQL | ACID, relational integrity |
| Friendships, Blocks | PostgreSQL | Complex JOIN queries |
| P2P Sessions, Ratings | PostgreSQL | Transactional |
| Reports (structured fields) | PostgreSQL | Queryable metrics |
| AI Conversation History | MongoDB | Flexible schema, nested messages |
| AI Long-term Memories | MongoDB | Dynamic content |
| Ice-breaker Scenarios | MongoDB | Rich JSON content |
| AI Feedback Reports (full) | MongoDB | Large nested JSON |

## PostgreSQL Schema

### users table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    english_level VARCHAR(5) DEFAULT 'A1',  -- A1,A2,B1,B2,C1,C2
    learning_goal VARCHAR(50),  -- CONVERSATION, IELTS, TOEFL, BUSINESS, TRAVEL
    native_language VARCHAR(50),
    timezone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### refresh_tokens table
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### friendships table
```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, ACCEPTED, BLOCKED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id)
);
```

### p2p_sessions table
```sql
CREATE TABLE p2p_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(100) UNIQUE NOT NULL,
    user1_id UUID REFERENCES users(id),
    user2_id UUID REFERENCES users(id),
    scenario_card_id VARCHAR(100),  -- MongoDB ObjectId ref
    status VARCHAR(20) DEFAULT 'WAITING',  -- WAITING, ACTIVE, ENDED
    match_type VARCHAR(20) DEFAULT 'RANDOM',  -- RANDOM, FRIEND
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INT,
    user1_rating SMALLINT,
    user2_rating SMALLINT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### ai_sessions table
```sql
CREATE TABLE ai_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    conversation_id VARCHAR(100),  -- MongoDB reference
    mode VARCHAR(20) NOT NULL,  -- ROLEPLAY, FREETALK
    scenario_id VARCHAR(100),   -- MongoDB reference (null for freetalk)
    status VARCHAR(20) DEFAULT 'ACTIVE',  -- ACTIVE, ENDED, ABANDONED
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_seconds INT,
    message_count INT DEFAULT 0,
    report_generated BOOLEAN DEFAULT false,
    report_id VARCHAR(100)  -- MongoDB reference
);
```

### user_stats table
```sql
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_ai_sessions INT DEFAULT 0,
    total_p2p_sessions INT DEFAULT 0,
    total_practice_minutes INT DEFAULT 0,
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_practice_date DATE,
    ai_avg_score DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## MongoDB Collections

### conversations collection
```json
{
  "_id": "ObjectId",
  "userId": "UUID-string",
  "sessionId": "UUID-string",
  "mode": "roleplay | freetalk",
  "scenarioId": "ObjectId | null",
  "messages": [
    {
      "role": "user | assistant",
      "content": "text",
      "audioUrl": "s3-url | null",
      "timestamp": "ISODate",
      "assistUsed": false
    }
  ],
  "startedAt": "ISODate",
  "endedAt": "ISODate",
  "durationSeconds": 1200
}
```

### ai_memories collection
```json
{
  "_id": "ObjectId",
  "userId": "UUID-string",
  "memories": [
    {
      "type": "personal_fact | event | preference | goal",
      "content": "User is preparing for IELTS in March",
      "capturedAt": "ISODate",
      "sourceSessionId": "UUID-string",
      "relevanceScore": 0.85
    }
  ],
  "updatedAt": "ISODate"
}
```

### scenarios collection (AI Roleplay)
```json
{
  "_id": "ObjectId",
  "title": "Job Interview at a Tech Company",
  "category": "WORK | TRAVEL | SOCIAL | ACADEMIC | DAILY",
  "difficulty": "A1 | A2 | B1 | B2 | C1 | C2",
  "aiCharacter": {
    "name": "Sarah",
    "role": "HR Manager",
    "personality": "Professional but friendly"
  },
  "systemPrompt": "You are Sarah, HR manager...",
  "openingLine": "Good morning! Please have a seat.",
  "learningGoals": ["job-related vocabulary", "formal register"],
  "estimatedDuration": 10,
  "isActive": true
}
```

### icebreaker_cards collection (P2P)
```json
{
  "_id": "ObjectId",
  "title": "Music Explorer",
  "task": "Find 3 songs you both love in 5 minutes",
  "category": "MUSIC | TRAVEL | FOOD | MOVIES | GOALS",
  "difficulty": "easy | medium | hard",
  "levelRange": ["A1", "B1"],
  "prompts": [
    "What's your all-time favorite song?",
    "Which artist would you love to see live?"
  ],
  "durationMinutes": 5
}
```

### feedback_reports collection
```json
{
  "_id": "ObjectId",
  "userId": "UUID-string",
  "sessionId": "UUID-string",
  "overallScore": 78,
  "grammarErrors": [
    { "original": "I go to store yesterday", "correction": "I went to the store yesterday", "explanation": "Past tense required" }
  ],
  "pronunciationTips": ["Focus on 'th' sounds"],
  "betterExpressions": [
    { "said": "very good", "better": "excellent / outstanding", "why": "More expressive" }
  ],
  "vocabularyHighlights": ["perseverance", "elaborate"],
  "encouragement": "Great progress! Your confidence is growing.",
  "nextFocus": "Article usage (a/an/the)",
  "generatedAt": "ISODate"
}
```

## Indexing Strategy
```sql
-- PostgreSQL indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level_goal ON users(english_level, learning_goal);
CREATE INDEX idx_friendships_users ON friendships(requester_id, addressee_id);
CREATE INDEX idx_p2p_sessions_status ON p2p_sessions(status, created_at);
CREATE INDEX idx_ai_sessions_user ON ai_sessions(user_id, created_at DESC);
```

```javascript
// MongoDB indexes
db.conversations.createIndex({ userId: 1, startedAt: -1 });
db.ai_memories.createIndex({ userId: 1 });
db.scenarios.createIndex({ difficulty: 1, category: 1, isActive: 1 });
db.icebreaker_cards.createIndex({ levelRange: 1, category: 1 });
```
