-- ==============================================================================
-- ImEnglish Database Schema Initialization (V1)
-- Dual Database Pattern: Relational schema for PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ROLES & PERMISSIONS
-- ==============================================================================
CREATE TABLE roles (
    id          VARCHAR(50) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES 
('ROLE_USER', 'Standard User', 'Default role for registered English learners'),
('ROLE_ADMIN', 'Administrator', 'Platform administrator with elevated access');

-- ==============================================================================
-- 2. USERS
-- ==============================================================================
CREATE TABLE users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email              VARCHAR(255) UNIQUE NOT NULL,
    username           VARCHAR(50) UNIQUE NOT NULL,
    password_hash      VARCHAR(255) NOT NULL,
    full_name          VARCHAR(100),
    avatar_url         VARCHAR(500),
    english_level      VARCHAR(10) DEFAULT 'A1',  -- A1, A2, B1, B2, C1, C2
    learning_goal      VARCHAR(50),               -- CONVERSATION, IELTS, BUSINESS, TRAVEL
    native_language    VARCHAR(50) DEFAULT 'vi',
    timezone           VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    oauth_provider     VARCHAR(20),               -- LOCAL, GOOGLE
    oauth_id           VARCHAR(100),
    is_active          BOOLEAN DEFAULT TRUE,
    is_email_verified  BOOLEAN DEFAULT FALSE,
    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);

-- User-Role Many-to-Many join table
CREATE TABLE user_roles (
    user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ==============================================================================
-- 3. REFRESH TOKENS (JWT Rotation & Revocation)
-- ==============================================================================
CREATE TABLE refresh_tokens (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash   VARCHAR(255) NOT NULL,
    device_info  VARCHAR(255),
    expires_at   TIMESTAMP NOT NULL,
    is_revoked   BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- ==============================================================================
-- 4. USER STATS (1-1 with users)
-- ==============================================================================
CREATE TABLE user_stats (
    user_id                UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_ai_sessions      INT DEFAULT 0,
    total_p2p_sessions     INT DEFAULT 0,
    total_practice_minutes INT DEFAULT 0,
    current_streak_days    INT DEFAULT 0,
    longest_streak_days    INT DEFAULT 0,
    last_practice_date     DATE,
    ai_avg_score           DECIMAL(5,2) DEFAULT 0.00,
    updated_at             TIMESTAMP DEFAULT NOW()
);

-- ==============================================================================
-- 5. FRIENDSHIPS & SOCIAL
-- ==============================================================================
CREATE TABLE friendships (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, ACCEPTED, BLOCKED
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_friendship_pair UNIQUE(requester_id, addressee_id)
);

-- ==============================================================================
-- 6. P2P SPEAKING SESSIONS
-- ==============================================================================
CREATE TABLE p2p_sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id           VARCHAR(100) UNIQUE NOT NULL,
    user1_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    user2_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    scenario_card_id  VARCHAR(100),  -- Reference to MongoDB icebreaker_cards ObjectId
    status            VARCHAR(20) DEFAULT 'WAITING',  -- WAITING, ACTIVE, ENDED, CANCELLED
    match_type        VARCHAR(20) DEFAULT 'RANDOM',   -- RANDOM, FRIEND
    started_at        TIMESTAMP,
    ended_at          TIMESTAMP,
    duration_seconds  INT DEFAULT 0,
    user1_rating      SMALLINT CHECK (user1_rating BETWEEN 1 AND 5),
    user2_rating      SMALLINT CHECK (user2_rating BETWEEN 1 AND 5),
    created_at        TIMESTAMP DEFAULT NOW()
);

-- ==============================================================================
-- 7. AI COMPANION SESSIONS
-- ==============================================================================
CREATE TABLE ai_sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id   VARCHAR(100),  -- Reference to MongoDB conversations ObjectId
    mode              VARCHAR(20) NOT NULL DEFAULT 'ROLEPLAY', -- ROLEPLAY, FREETALK
    scenario_id       VARCHAR(100),  -- Reference to MongoDB scenarios ObjectId
    status            VARCHAR(20) DEFAULT 'ACTIVE',            -- ACTIVE, ENDED, ABANDONED
    started_at        TIMESTAMP DEFAULT NOW(),
    ended_at          TIMESTAMP,
    duration_seconds  INT DEFAULT 0,
    message_count     INT DEFAULT 0,
    report_generated  BOOLEAN DEFAULT FALSE,
    report_id         VARCHAR(100)   -- Reference to MongoDB feedback_reports ObjectId
);

-- ==============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_level_goal ON users(english_level, learning_goal);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_friendships_users ON friendships(requester_id, addressee_id);
CREATE INDEX idx_p2p_sessions_status ON p2p_sessions(status, created_at);
CREATE INDEX idx_ai_sessions_user ON ai_sessions(user_id, started_at DESC);
