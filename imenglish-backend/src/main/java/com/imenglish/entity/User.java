package com.imenglish.entity;

import com.imenglish.enums.EnglishLevel;
import com.imenglish.enums.LearningGoal;
import com.imenglish.enums.OAuthProvider;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "english_level", length = 10)
    @Builder.Default
    private EnglishLevel englishLevel = EnglishLevel.A1;

    @Enumerated(EnumType.STRING)
    @Column(name = "learning_goal", length = 50)
    private LearningGoal learningGoal;

    @Column(name = "native_language", length = 50)
    @Builder.Default
    private String nativeLanguage = "vi";

    @Column(length = 50)
    @Builder.Default
    private String timezone = "Asia/Ho_Chi_Minh";

    @Enumerated(EnumType.STRING)
    @Column(name = "oauth_provider", length = 20)
    @Builder.Default
    private OAuthProvider oauthProvider = OAuthProvider.LOCAL;

    @Column(name = "oauth_id", length = 100)
    private String oauthId;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_email_verified")
    @Builder.Default
    private Boolean isEmailVerified = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
