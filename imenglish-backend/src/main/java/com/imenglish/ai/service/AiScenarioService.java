package com.imenglish.ai.service;

import com.imenglish.ai.dto.response.ScenarioResponse;
import com.imenglish.dto.response.PageResponse;
import com.imenglish.enums.EnglishLevel;

import java.util.List;

public interface AiScenarioService {

    PageResponse<ScenarioResponse> getScenarios(String topic, EnglishLevel level, String keyword, int page, int size);

    ScenarioResponse getScenarioById(String id);

    List<String> getAllTopics();

    List<ScenarioResponse> getFeaturedScenarios(EnglishLevel level, int limit);
}
