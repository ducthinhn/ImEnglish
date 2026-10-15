package com.imenglish.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class UserStats {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_ai_sessions")
    @Builder.Default
    private Integer totalAiSessions = 0;

    @Column(name = "total_p2p_sessions")
    @Builder.Default
    private Integer totalP2pSessions = 0;

    @Column(name = "total_practice_minutes")
    @Builder.Default
    private Integer totalPracticeMinutes = 0;

    @Column(name = "current_streak_days")
    @Builder.Default
    private Integer currentStreakDays = 0;

    @Column(name = "longest_streak_days")
    @Builder.Default
    private Integer longestStreakDays = 0;

    @Column(name = "last_practice_date")
    private LocalDate lastPracticeDate;

    @Column(name = "ai_avg_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal aiAvgScore = BigDecimal.ZERO;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
