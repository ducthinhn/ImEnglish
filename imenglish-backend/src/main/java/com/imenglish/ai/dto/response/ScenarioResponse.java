package com.imenglish.ai.dto.response;

import com.imenglish.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScenarioResponse {

    private String id;
    private String code;
    private String title;
    private String topic;
    private EnglishLevel cefrLevel;
    private String difficulty;
    private int estimatedDurationMinutes;
    private String description;
    private String aiRole;
    private String userRole;
    private String initialGreeting;
    private List<String> suggestedVocabulary;
    private List<String> conversationGoals;
    private String icon;
    private int orderIndex;
}
