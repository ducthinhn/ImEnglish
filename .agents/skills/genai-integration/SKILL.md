---
name: genai-integration
description: |
  Google Gemini / OpenAI integration skill for ImEnglish AI Companion features.
  Covers AI conversation flow, long-term memory pattern, feedback report generation,
  real-time suggestion (assist), and Spring AI integration.
tags: [ai, gemini, openai, spring-ai, long-term-memory]
---

# GenAI Integration Skill for ImEnglish

## AI Features Overview
1. **Role-play AI** — Scenario-based conversation (e.g., job interview, restaurant)
2. **Free-talk AI** — Open conversation with long-term memory
3. **Real-time Assist** — 3 quick reply suggestions when user hesitates
4. **Feedback Report** — Post-call grammar/pronunciation analysis

## Spring AI Configuration
```yaml
# application.yml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4o
          temperature: 0.7
    # OR Gemini via Vertex AI
    vertex:
      ai:
        gemini:
          project-id: ${GCP_PROJECT_ID}
          location: us-central1
          chat:
            options:
              model: gemini-1.5-pro
```

## System Prompt Templates

### Role-play AI Prompt
```
You are playing the role of: {character_name}
Scenario: {scenario_description}
User's English level: {level} ({level_description})
Rules:
- Stay in character throughout the conversation
- If user makes grammar errors, continue naturally (don't correct mid-conversation)
- Adjust vocabulary complexity to match user's level
- If user hesitates >5 seconds, gently prompt them
Language: English only (unless user explicitly asks for help)
```

### Free-talk AI Prompt (with Long-term Memory)
```
You are Jamie, a friendly native English speaker who loves language exchange.
You have known {user_name} for a while.

Your memories of {user_name}:
{long_term_memory_summary}

Recent conversation summary:
{recent_summary}

Rules:
- Be warm, encouraging, and natural
- Reference past memories naturally (not robotically)
- Ask follow-up questions about things user mentioned before
- Don't correct errors mid-conversation
```

### Real-time Assist Prompt
```
The user is having a conversation in English and needs quick suggestions.
Context: {last_3_messages}
User's message so far (incomplete): "{partial_input}"
Provide exactly 3 SHORT, natural English responses (under 15 words each).
Format: JSON array of strings.
```

### Feedback Report Prompt
```
Analyze this English conversation transcript and generate a detailed feedback report.
Transcript: {full_transcript}
User's level: {level}

Return JSON with:
{
  "overall_score": 0-100,
  "grammar_errors": [{ "original": "...", "correction": "...", "explanation": "..." }],
  "pronunciation_tips": ["..."],
  "better_expressions": [{ "said": "...", "better": "...", "why": "..." }],
  "vocabulary_used": ["good words used"],
  "encouragement": "positive message",
  "next_focus": "what to practice next"
}
```

## Long-term Memory Pattern (MongoDB)
```java
// MongoDB Document
@Document("ai_memories")
public class AiMemory {
    @Id private String id;
    private String userId;
    private String memoryType;  // "personal_fact", "event", "preference"
    private String content;     // "User's interview is on Friday"
    private LocalDateTime capturedAt;
    private double relevanceScore;
}

// After each conversation, extract memories via AI
public void extractAndStoreMemories(String userId, String transcript) {
    String extractPrompt = """
        Extract personal facts/events from this conversation.
        Return JSON: [{ "type": "...", "content": "..." }]
        Transcript: """ + transcript;
    
    String memories = aiClient.call(extractPrompt);
    // Parse and save to MongoDB
}
```

## Conversation History (MongoDB)
```java
@Document("conversations")
public class Conversation {
    @Id private String id;
    private String userId;
    private String sessionId;
    private String mode;  // "roleplay" | "freetalk"
    private String scenarioId;  // null for freetalk
    private List<Message> messages;
    private FeedbackReport feedbackReport;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private int durationSeconds;
}
```

## Token Management (Cost Control)
- Limit conversation context to last 20 messages
- Summarize older messages with AI before removing from context
- Cache common scenario system prompts
- Rate limit: 10 AI calls/minute per user
