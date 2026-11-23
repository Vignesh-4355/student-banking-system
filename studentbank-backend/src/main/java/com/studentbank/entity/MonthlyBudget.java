package com.studentbank.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_budgets")
public class MonthlyBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ExpenseCategory category;

    @Column(name = "month_year", nullable = false, length = 7)
    private String monthYear; // 'YYYY-MM'

    @Column(name = "allocated_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(name = "spent_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(name = "alert_threshold_percentage", nullable = false)
    private Integer alertThresholdPercentage = 80;

    @Column(name = "is_alert_triggered", nullable = false)
    private Boolean isAlertTriggered = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public MonthlyBudget() {
    }

    public MonthlyBudget(User user, ExpenseCategory category, String monthYear, BigDecimal allocatedAmount, BigDecimal spentAmount) {
        this.user = user;
        this.category = category;
        this.monthYear = monthYear;
        this.allocatedAmount = allocatedAmount;
        this.spentAmount = spentAmount;
        this.alertThresholdPercentage = 80;
        this.isAlertTriggered = spentAmount.compareTo(allocatedAmount.multiply(new BigDecimal("0.80"))) >= 0;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public String getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(String monthYear) {
        this.monthYear = monthYear;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public Integer getAlertThresholdPercentage() {
        return alertThresholdPercentage;
    }

    public void setAlertThresholdPercentage(Integer alertThresholdPercentage) {
        this.alertThresholdPercentage = alertThresholdPercentage;
    }

    public Boolean getIsAlertTriggered() {
        return isAlertTriggered;
    }

    public void setIsAlertTriggered(Boolean isAlertTriggered) {
        this.isAlertTriggered = isAlertTriggered;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
