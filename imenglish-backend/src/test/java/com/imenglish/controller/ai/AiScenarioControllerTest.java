package com.imenglish.controller.ai;

import com.imenglish.ai.document.ScenarioDocument;
import com.imenglish.ai.repository.ScenarioRepository;
import com.imenglish.enums.EnglishLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AiScenarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScenarioRepository scenarioRepository;

    private ScenarioDocument testScenario;

    @BeforeEach
    void setUp() {
        if (!scenarioRepository.findByCode("TEST_CAFE_SCENARIO").isPresent()) {
            testScenario = ScenarioDocument.builder()
                    .code("TEST_CAFE_SCENARIO")
                    .title("Testing Café Scenario")
                    .topic("Food & Dining")
                    .cefrLevel(EnglishLevel.B1)
                    .difficulty("Intermediate")
                    .estimatedDurationMinutes(4)
                    .description("Test description for ordering coffee")
                    .aiRole("Barista")
                    .userRole("Customer")
                    .initialGreeting("Hello! What can I get for you?")
                    .suggestedVocabulary(List.of("latte", "espresso"))
                    .conversationGoals(List.of("Order a drink"))
                    .icon("☕")
                    .orderIndex(999)
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            testScenario = scenarioRepository.save(testScenario);
        } else {
            testScenario = scenarioRepository.findByCode("TEST_CAFE_SCENARIO").get();
        }
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios - Should return paginated scenarios")
    void shouldReturnPaginatedScenarios() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items", notNullValue()))
                .andExpect(jsonPath("$.data.items", not(empty())))
                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios?topic=Food & Dining - Should filter by topic")
    void shouldFilterScenariosByTopic() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios")
                        .param("topic", "Food & Dining")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items", not(empty())))
                .andExpect(jsonPath("$.data.items[0].topic", is("Food & Dining")));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios?level=B1 - Should filter by CEFR level")
    void shouldFilterScenariosByLevel() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios")
                        .param("level", "B1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items", not(empty())))
                .andExpect(jsonPath("$.data.items[0].cefrLevel", is("B1")));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios?keyword=Testing Café - Should search scenarios by keyword")
    void shouldSearchScenariosByKeyword() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios")
                        .param("keyword", "Testing Café")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items", not(empty())))
                .andExpect(jsonPath("$.data.items[0].code", is("TEST_CAFE_SCENARIO")));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios/{id} - Should return scenario details when found")
    void shouldReturnScenarioById() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios/" + testScenario.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(testScenario.getId())))
                .andExpect(jsonPath("$.data.code", is(testScenario.getCode())))
                .andExpect(jsonPath("$.data.title", is(testScenario.getTitle())));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios/{id} - Should return 404 when scenario not found")
    void shouldReturn404WhenScenarioNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios/nonexistent-id-999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios/topics - Should return list of topics")
    void shouldReturnAllTopics() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios/topics")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", not(empty())))
                .andExpect(jsonPath("$.data", hasItem("Food & Dining")));
    }

    @Test
    @DisplayName("GET /api/v1/ai/scenarios/featured - Should return featured list")
    void shouldReturnFeaturedScenarios() throws Exception {
        mockMvc.perform(get("/api/v1/ai/scenarios/featured")
                        .param("limit", "4")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", not(empty())))
                .andExpect(jsonPath("$.data.length()", lessThanOrEqualTo(4)));
    }
}
