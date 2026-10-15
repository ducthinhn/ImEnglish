package com.imenglish.entity;

import com.imenglish.enums.P2pSessionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "p2p_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class P2pSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "room_id", nullable = false, unique = true, length = 100)
    private String roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id")
    private User user2;

    @Column(name = "scenario_card_id", length = 100)
    private String scenarioCardId; // Reference to MongoDB icebreaker_cards ObjectId

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private P2pSessionStatus status = P2pSessionStatus.WAITING;

    @Column(name = "match_type", length = 20)
    @Builder.Default
    private String matchType = "RANDOM";

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "duration_seconds")
    @Builder.Default
    private Integer durationSeconds = 0;

    @Column(name = "user1_rating")
    private Short user1Rating;

    @Column(name = "user2_rating")
    private Short user2Rating;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
