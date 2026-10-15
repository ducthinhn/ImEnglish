# 🗄️ THIẾT KẾ CƠ SỞ DỮ LIỆU — ImEnglish

> Dual Database: PostgreSQL + MongoDB | v1.0

---

## 1. CHIẾN LƯỢC PHÂN CHIA

```
┌──────────────────────────┬────────────────────────────────────┐
│      PostgreSQL           │           MongoDB                  │
│  (Dữ liệu có cấu trúc)   │   (Dữ liệu phi cấu trúc / AI)    │
├──────────────────────────┼────────────────────────────────────┤
│ • Users, Auth             │ • Lịch sử hội thoại AI            │
│ • Quan hệ bạn bè          │ • Bộ nhớ dài hạn AI               │
│ • Phiên P2P               │ • Kịch bản Roleplay               │
│ • Thống kê học tập        │ • Thẻ Ice-breaker P2P             │
│ → ACID, JOIN, relational  │ • Feedback Reports                │
│                           │ → Flexible schema, nested JSON    │
└──────────────────────────┴────────────────────────────────────┘
```

| Loại dữ liệu | Database | Lý do |
|-------------|----------|-------|
| Users, Auth, Profiles | PostgreSQL | ACID, toàn vẹn dữ liệu |
| Friendships, Blocks | PostgreSQL | Complex JOIN queries |
| P2P Sessions, Ratings | PostgreSQL | Transactional |
| AI Conversation History | MongoDB | Flexible, nested messages |
| AI Long-term Memories | MongoDB | Dynamic content |
| Roleplay Scenarios | MongoDB | Rich JSON content |
| Ice-breaker Cards | MongoDB | Dễ cập nhật, thêm fields |
| Feedback Reports | MongoDB | Large nested JSON |

---

## 2. POSTGRESQL — LƯỢC ĐỒ QUAN HỆ

### 2.1. Bảng `users`

```sql
CREATE TABLE users (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email            VARCHAR(255) UNIQUE NOT NULL,
    username         VARCHAR(50)  UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    full_name        VARCHAR(100),
    avatar_url       VARCHAR(500),
    english_level    VARCHAR(5)   DEFAULT 'A1',  -- A1/A2/B1/B2/C1/C2
    learning_goal    VARCHAR(50),                 -- CONVERSATION/IELTS/BUSINESS/TRAVEL
    native_language  VARCHAR(50),
    timezone         VARCHAR(50),
    oauth_provider   VARCHAR(20),                 -- GOOGLE | null
    oauth_id         VARCHAR(100),
    is_active        BOOLEAN      DEFAULT true,
    is_email_verified BOOLEAN     DEFAULT false,
    created_at       TIMESTAMP    DEFAULT NOW(),
    updated_at       TIMESTAMP    DEFAULT NOW()
);
```

### 2.2. Bảng `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        REFERENCES users(id) ON DELETE CASCADE,
    token_hash   VARCHAR(255) NOT NULL,    -- SHA-256 hash
    device_info  VARCHAR(255),
    expires_at   TIMESTAMP    NOT NULL,
    is_revoked   BOOLEAN      DEFAULT false,
    created_at   TIMESTAMP    DEFAULT NOW()
);
```

### 2.3. Bảng `friendships`

```sql
CREATE TABLE friendships (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id  UUID        REFERENCES users(id) ON DELETE CASCADE,
    addressee_id  UUID        REFERENCES users(id) ON DELETE CASCADE,
    status        VARCHAR(20) DEFAULT 'PENDING',  -- PENDING/ACCEPTED/BLOCKED
    created_at    TIMESTAMP   DEFAULT NOW(),
    updated_at    TIMESTAMP   DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id)
);
```

### 2.4. Bảng `p2p_sessions`

```sql
CREATE TABLE p2p_sessions (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id           VARCHAR(100) UNIQUE NOT NULL,
    user1_id          UUID        REFERENCES users(id),
    user2_id          UUID        REFERENCES users(id),
    scenario_card_id  VARCHAR(100),    -- MongoDB ObjectId (ice-breaker card)
    status            VARCHAR(20)  DEFAULT 'WAITING',  -- WAITING/ACTIVE/ENDED
    match_type        VARCHAR(20)  DEFAULT 'RANDOM',   -- RANDOM/FRIEND
    started_at        TIMESTAMP,
    ended_at          TIMESTAMP,
    duration_seconds  INT,
    user1_rating      SMALLINT CHECK (user1_rating BETWEEN 1 AND 5),
    user2_rating      SMALLINT CHECK (user2_rating BETWEEN 1 AND 5),
    created_at        TIMESTAMP    DEFAULT NOW()
);
```

### 2.5. Bảng `ai_sessions`

```sql
CREATE TABLE ai_sessions (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID        REFERENCES users(id) ON DELETE CASCADE,
    conversation_id   VARCHAR(100),   -- MongoDB ObjectId
    mode              VARCHAR(20)  NOT NULL,   -- ROLEPLAY/FREETALK
    scenario_id       VARCHAR(100),            -- MongoDB ObjectId (null for freetalk)
    status            VARCHAR(20)  DEFAULT 'ACTIVE',  -- ACTIVE/ENDED/ABANDONED
    started_at        TIMESTAMP    DEFAULT NOW(),
    ended_at          TIMESTAMP,
    duration_seconds  INT,
    message_count     INT          DEFAULT 0,
    report_generated  BOOLEAN      DEFAULT false,
    report_id         VARCHAR(100)             -- MongoDB ObjectId
);
```

### 2.6. Bảng `user_stats`

```sql
CREATE TABLE user_stats (
    user_id                UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_ai_sessions      INT         DEFAULT 0,
    total_p2p_sessions     INT         DEFAULT 0,
    total_practice_minutes INT         DEFAULT 0,
    current_streak_days    INT         DEFAULT 0,
    longest_streak_days    INT         DEFAULT 0,
    last_practice_date     DATE,
    ai_avg_score           DECIMAL(5,2) DEFAULT 0,
    updated_at             TIMESTAMP   DEFAULT NOW()
);
```

### ERD Tóm Tắt

```
users ──────────< refresh_tokens
  │
  ├──────────< ai_sessions
  │
  ├──────────< user_stats (1-1)
  │
  ├──────────< friendships (requester)
  ├──────────< friendships (addressee)
  │
  ├──────────< p2p_sessions (user1)
  └──────────< p2p_sessions (user2)
```

---

## 3. MONGODB — CÁC COLLECTIONS

### 3.1. Collection `conversations`

```json
{
  "_id": "ObjectId",
  "userId": "UUID-string",           // ref: users.id (PostgreSQL)
  "sessionId": "UUID-string",        // ref: ai_sessions.id (PostgreSQL)
  "mode": "roleplay | freetalk",
  "scenarioId": "ObjectId | null",   // ref: scenarios collection
  "messages": [
    {
      "role": "user | assistant",
      "content": "Nội dung tin nhắn",
      "audioUrl": "s3-url | null",
      "timestamp": "2026-10-14T10:00:00Z",
      "assistUsed": false
    }
  ],
  "startedAt": "ISODate",
  "endedAt": "ISODate",
  "durationSeconds": 1200
}
```

### 3.2. Collection `ai_memories`

```json
{
  "_id": "ObjectId",
  "userId": "UUID-string",           // 1 document per user
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

### 3.3. Collection `scenarios`

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
  "systemPrompt": "You are Sarah, HR manager at a tech startup...",
  "openingLine": "Good morning! Please have a seat.",
  "learningGoals": ["job-related vocabulary", "formal register"],
  "estimatedDuration": 10,
  "isActive": true
}
```

### 3.4. Collection `icebreaker_cards`

```json
{
  "_id": "ObjectId",
  "title": "Music Explorer",
  "task": "Find 3 songs you both love in 5 minutes",
  "category": "MUSIC | TRAVEL | FOOD | MOVIES | GOALS | CULTURE",
  "difficulty": "easy | medium | hard",
  "levelRange": ["A1", "B1"],
  "prompts": [
    "What's your all-time favorite song?",
    "Which artist would you love to see live?"
  ],
  "durationMinutes": 5
}
```

### 3.5. Collection `feedback_reports`

```json
{
  "_id": "ObjectId",
  "userId": "UUID-string",
  "sessionId": "UUID-string",
  "overallScore": 78,
  "grammarErrors": [
    {
      "original": "I go to store yesterday",
      "correction": "I went to the store yesterday",
      "explanation": "Past simple tense required for completed past actions"
    }
  ],
  "pronunciationTips": ["Focus on 'th' sounds: 'the', 'there', 'think'"],
  "betterExpressions": [
    {
      "said": "very good",
      "better": "excellent / outstanding / impressive",
      "why": "Richer vocabulary, more impactful"
    }
  ],
  "vocabularyHighlights": ["perseverance", "elaborate", "negotiate"],
  "encouragement": "Great session! Your confidence is clearly growing.",
  "nextFocus": "Article usage (a/an/the) — practice with daily objects",
  "generatedAt": "ISODate"
}
```

---

## 4. INDEXING STRATEGY

### PostgreSQL Indexes

```sql
-- Tìm kiếm đăng nhập
CREATE INDEX idx_users_email ON users(email);

-- Matching P2P (level + goal)
CREATE INDEX idx_users_level_goal ON users(english_level, learning_goal);

-- Kiểm tra quan hệ bạn bè
CREATE INDEX idx_friendships_users ON friendships(requester_id, addressee_id);

-- Tìm phòng đang chờ ghép cặp
CREATE INDEX idx_p2p_sessions_status ON p2p_sessions(status, created_at);

-- Lịch sử buổi học của user
CREATE INDEX idx_ai_sessions_user ON ai_sessions(user_id, created_at DESC);

-- Xác thực refresh token
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
```

### MongoDB Indexes

```javascript
// Lịch sử hội thoại
db.conversations.createIndex({ userId: 1, startedAt: -1 });

// Tìm ký ức của user
db.ai_memories.createIndex({ userId: 1 });

// Lọc kịch bản theo cấp độ/chủ đề
db.scenarios.createIndex({ difficulty: 1, category: 1, isActive: 1 });

// Chọn thẻ ice-breaker phù hợp
db.icebreaker_cards.createIndex({ levelRange: 1, category: 1 });

// Xem lịch sử báo cáo
db.feedback_reports.createIndex({ userId: 1, generatedAt: -1 });
```
