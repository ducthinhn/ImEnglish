package com.imenglish.ai.service.impl;

import com.imenglish.ai.document.ScenarioDocument;
import com.imenglish.ai.dto.response.ScenarioResponse;
import com.imenglish.ai.mapper.ScenarioMapper;
import com.imenglish.ai.repository.ScenarioRepository;
import com.imenglish.ai.service.AiScenarioService;
import com.imenglish.dto.response.PageResponse;
import com.imenglish.enums.EnglishLevel;
import com.imenglish.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiScenarioServiceImpl implements AiScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final ScenarioMapper scenarioMapper;

    @Override
    public PageResponse<ScenarioResponse> getScenarios(
            String topic,
            EnglishLevel level,
            String keyword,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "orderIndex", "title"));
        Page<ScenarioDocument> documentPage;

        if (keyword != null && !keyword.trim().isEmpty()) {
            documentPage = scenarioRepository.searchScenarios(keyword.trim(), pageable);
        } else if (topic != null && !topic.trim().isEmpty() && level != null) {
            documentPage = scenarioRepository.findByIsActiveTrueAndTopicAndCefrLevel(topic.trim(), level, pageable);
        } else if (topic != null && !topic.trim().isEmpty()) {
            documentPage = scenarioRepository.findByIsActiveTrueAndTopic(topic.trim(), pageable);
        } else if (level != null) {
            documentPage = scenarioRepository.findByIsActiveTrueAndCefrLevel(level, pageable);
        } else {
            documentPage = scenarioRepository.findByIsActiveTrue(pageable);
        }

        Page<ScenarioResponse> responsePage = documentPage.map(scenarioMapper::toResponse);
        return PageResponse.from(responsePage);
    }

    @Override
    public ScenarioResponse getScenarioById(String id) {
        ScenarioDocument document = scenarioRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scenario not found with ID: " + id));
        return scenarioMapper.toResponse(document);
    }

    @Override
    public List<String> getAllTopics() {
        return List.of(
                "Food & Dining",
                "Travel & Tourism",
                "Career & Business",
                "Daily Life & Housing",
                "Socializing & Friends",
                "Health & Well-being",
                "Shopping & Services",
                "Academic & IELTS"
        );
    }

    @Override
    public List<ScenarioResponse> getFeaturedScenarios(EnglishLevel level, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.ASC, "orderIndex"));
        Page<ScenarioDocument> page;
        if (level != null) {
            page = scenarioRepository.findByIsActiveTrueAndCefrLevel(level, pageable);
        } else {
            page = scenarioRepository.findByIsActiveTrue(pageable);
        }
        return scenarioMapper.toResponseList(page.getContent());
    }
}
