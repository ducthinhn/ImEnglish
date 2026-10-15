package com.imenglish.dto.response;

import com.imenglish.enums.EnglishLevel;
import com.imenglish.enums.LearningGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;
    private String email;
    private String username;
    private String fullName;
    private String avatarUrl;
    private EnglishLevel englishLevel;
    private LearningGoal learningGoal;
    private String nativeLanguage;
    private String timezone;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private Set<String> roles;
    private LocalDateTime createdAt;
}
