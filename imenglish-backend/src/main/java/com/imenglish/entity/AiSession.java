package com.imenglish.entity;

import com.imenglish.enums.AiSessionMode;
import com.imenglish.enums.AiSessionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class AiSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "conversation_id", length = 100)
    private String conversationId; // Reference to MongoDB conversations ObjectId

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AiSessionMode mode = AiSessionMode.ROLEPLAY;

    @Column(name = "scenario_id", length = 100)
    private String scenarioId; // Reference to MongoDB scenarios ObjectId

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AiSessionStatus status = AiSessionStatus.ACTIVE;

    @CreatedDate
    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "duration_seconds")
    @Builder.Default
    private Integer durationSeconds = 0;

    @Column(name = "message_count")
    @Builder.Default
    private Integer messageCount = 0;

    @Column(name = "report_generated")
    @Builder.Default
    private Boolean reportGenerated = false;

    @Column(name = "report_id", length = 100)
    private String reportId; // Reference to MongoDB feedback_reports ObjectId
}
