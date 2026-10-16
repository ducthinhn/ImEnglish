package com.imenglish.ai.document;

import com.imenglish.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_scenarios")
public class ScenarioDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String code;

    private String title;

    @Indexed
    private String topic;

    @Indexed
    private EnglishLevel cefrLevel;

    private String difficulty;

    private int estimatedDurationMinutes;

    private String description;

    private String aiRole;

    private String userRole;

    private String initialGreeting;

    private String systemPromptInstruction;

    @Builder.Default
    private List<String> suggestedVocabulary = new ArrayList<>();

    @Builder.Default
    private List<String> conversationGoals = new ArrayList<>();

    private String icon;

    private int orderIndex;

    @Builder.Default
    private boolean isActive = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
