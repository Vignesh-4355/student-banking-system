package com.studentbank.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_challenges")
public class FinancialChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "challenge_type", nullable = false, length = 30)
    private String challengeType;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "reward_points", nullable = false)
    private Integer rewardPoints = 100;

    @Column(name = "target_savings", nullable = false, precision = 12, scale = 2)
    private BigDecimal targetSavings = BigDecimal.ZERO;

    @Column(name = "badge_name", nullable = false, length = 50)
    private String badgeName;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public FinancialChallenge() {
    }

    public FinancialChallenge(String title, String description, String challengeType, Integer durationDays,
                              Integer rewardPoints, BigDecimal targetSavings, String badgeName) {
        this.title = title;
        this.description = description;
        this.challengeType = challengeType;
        this.durationDays = durationDays;
        this.rewardPoints = rewardPoints;
        this.targetSavings = targetSavings;
        this.badgeName = badgeName;
        this.isActive = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getChallengeType() {
        return challengeType;
    }

    public void setChallengeType(String challengeType) {
        this.challengeType = challengeType;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getRewardPoints() {
        return rewardPoints;
    }

    public void setRewardPoints(Integer rewardPoints) {
        this.rewardPoints = rewardPoints;
    }

    public BigDecimal getTargetSavings() {
        return targetSavings;
    }

    public void setTargetSavings(BigDecimal targetSavings) {
        this.targetSavings = targetSavings;
    }

    public String getBadgeName() {
        return badgeName;
    }

    public void setBadgeName(String badgeName) {
        this.badgeName = badgeName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
