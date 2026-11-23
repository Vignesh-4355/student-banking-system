package com.studentbank.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_rewards")
public class StudentReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "badge_title", nullable = false, length = 100)
    private String badgeTitle;

    @Column(name = "badge_category", nullable = false, length = 50)
    private String badgeCategory;

    @Column(name = "points_awarded", nullable = false)
    private Integer pointsAwarded = 50;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "icon_name", nullable = false, length = 50)
    private String iconName = "Award";

    @Column(name = "unlocked_at", updatable = false)
    private LocalDateTime unlockedAt;

    public StudentReward() {
    }

    public StudentReward(User user, String badgeTitle, String badgeCategory, Integer pointsAwarded, String description, String iconName) {
        this.user = user;
        this.badgeTitle = badgeTitle;
        this.badgeCategory = badgeCategory;
        this.pointsAwarded = pointsAwarded;
        this.description = description;
        this.iconName = iconName;
    }

    @PrePersist
    protected void onCreate() {
        this.unlockedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBadgeTitle() {
        return badgeTitle;
    }

    public void setBadgeTitle(String badgeTitle) {
        this.badgeTitle = badgeTitle;
    }

    public String getBadgeCategory() {
        return badgeCategory;
    }

    public void setBadgeCategory(String badgeCategory) {
        this.badgeCategory = badgeCategory;
    }

    public Integer getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(Integer pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }
}
