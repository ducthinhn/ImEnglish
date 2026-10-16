package com.imenglish.ai.controller;

import com.imenglish.ai.dto.response.ScenarioResponse;
import com.imenglish.ai.service.AiScenarioService;
import com.imenglish.dto.response.ApiResponse;
import com.imenglish.dto.response.PageResponse;
import com.imenglish.enums.EnglishLevel;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai/scenarios")
@RequiredArgsConstructor
@Tag(name = "AI Scenarios", description = "Endpoints for exploring and filtering roleplay conversation scenarios")
public class AiScenarioController {

    private final AiScenarioService aiScenarioService;

    @GetMapping
    @Operation(summary = "Get paginated AI scenarios", description = "Query scenarios with optional filters for topic, CEFR level, or search keyword")
    public ResponseEntity<ApiResponse<PageResponse<ScenarioResponse>>> getScenarios(
            @Parameter(description = "Filter by topic (e.g. 'Food & Dining', 'Travel & Tourism', 'Career & Business')")
            @RequestParam(required = false) String topic,

            @Parameter(description = "Filter by CEFR Level (A1, A2, B1, B2, C1, C2)")
            @RequestParam(required = false) EnglishLevel level,

            @Parameter(description = "Search keyword in title, description, or topic")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Zero-based page index")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<ScenarioResponse> response = aiScenarioService.getScenarios(topic, level, keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success("Scenarios retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get scenario details by ID", description = "Retrieve full scenario context, goals, and initial greeting")
    public ResponseEntity<ApiResponse<ScenarioResponse>> getScenarioById(
            @Parameter(description = "Scenario document ID")
            @PathVariable String id
    ) {
        ScenarioResponse response = aiScenarioService.getScenarioById(id);
        return ResponseEntity.ok(ApiResponse.success("Scenario details retrieved successfully", response));
    }

    @GetMapping("/topics")
    @Operation(summary = "Get all available scenario topics", description = "Returns a curated list of all conversation topics")
    public ResponseEntity<ApiResponse<List<String>>> getAllTopics() {
        List<String> topics = aiScenarioService.getAllTopics();
        return ResponseEntity.ok(ApiResponse.success("Topics retrieved successfully", topics));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured scenarios", description = "Returns top scenarios tailored to learner's level for dashboard display")
    public ResponseEntity<ApiResponse<List<ScenarioResponse>>> getFeaturedScenarios(
            @Parameter(description = "Learner's CEFR level")
            @RequestParam(required = false) EnglishLevel level,

            @Parameter(description = "Maximum number of scenarios to return")
            @RequestParam(defaultValue = "4") int limit
    ) {
        List<ScenarioResponse> featured = aiScenarioService.getFeaturedScenarios(level, limit);
        return ResponseEntity.ok(ApiResponse.success("Featured scenarios retrieved successfully", featured));
    }
}
