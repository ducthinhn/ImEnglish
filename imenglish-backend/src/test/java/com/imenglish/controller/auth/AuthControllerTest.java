package com.imenglish.controller.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.imenglish.dto.request.LoginRequest;
import com.imenglish.dto.request.RefreshTokenRequest;
import com.imenglish.dto.request.RegisterRequest;
import com.imenglish.dto.response.AuthResponse;
import com.imenglish.enums.EnglishLevel;
import com.imenglish.enums.LearningGoal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String savedRefreshToken;

    @Test
    @Order(1)
    @DisplayName("POST /api/v1/auth/register - Should register user successfully")
    void shouldRegisterUserSuccessfully() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("testlearner@example.com")
                .username("testlearner")
                .password("Password123!")
                .fullName("Test Learner")
                .englishLevel(EnglishLevel.B1)
                .learningGoal(LearningGoal.CONVERSATION)
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("testlearner@example.com")))
                .andExpect(jsonPath("$.data.user.username", is("testlearner")))
                .andExpect(jsonPath("$.data.user.englishLevel", is("B1")))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readTree(json).get("data").traverse(objectMapper).readValueAs(AuthResponse.class);
        savedRefreshToken = authResponse.getRefreshToken();
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/v1/auth/register - Should fail when email already registered")
    void shouldFailRegisterWhenEmailExists() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("testlearner@example.com")
                .username("anotherlearner")
                .password("Password123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("already registered")));
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/v1/auth/register - Should fail validation when password is too short")
    void shouldFailRegisterWhenPasswordTooShort() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("shortpass@example.com")
                .username("shortpass")
                .password("short")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errors", not(empty())));
    }

    @Test
    @Order(4)
    @DisplayName("POST /api/v1/auth/login - Should login successfully with valid credentials")
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("testlearner@example.com")
                .password("Password123!")
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken", notNullValue()))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readTree(json).get("data").traverse(objectMapper).readValueAs(AuthResponse.class);
        savedRefreshToken = authResponse.getRefreshToken();
    }

    @Test
    @Order(5)
    @DisplayName("POST /api/v1/auth/login - Should fail with wrong password")
    void shouldFailLoginWithWrongPassword() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("testlearner@example.com")
                .password("WrongPassword123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/v1/auth/refresh - Should refresh tokens successfully")
    void shouldRefreshTokensSuccessfully() throws Exception {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken(savedRefreshToken)
                .build();

        MvcResult result = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken", notNullValue()))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readTree(json).get("data").traverse(objectMapper).readValueAs(AuthResponse.class);
        savedRefreshToken = authResponse.getRefreshToken();
    }

    @Test
    @Order(7)
    @DisplayName("POST /api/v1/auth/logout - Should logout successfully")
    void shouldLogoutSuccessfully() throws Exception {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken(savedRefreshToken)
                .build();

        mockMvc.perform(post("/api/v1/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", containsString("Logged out successfully")));
    }
}
