package com.studentbank.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "provider_name", nullable = false, length = 150)
    private String providerName;

    @Column(name = "scholarship_type", nullable = false, length = 30)
    private String scholarshipType; // GOVERNMENT, PRIVATE

    @Column(name = "award_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal awardAmount;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(name = "applicable_courses", columnDefinition = "TEXT")
    private String applicableCourses;

    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @Column(name = "official_link", length = 500)
    private String officialLink;

    @Column(name = "required_documents", columnDefinition = "TEXT")
    private String requiredDocuments;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Scholarship() {
    }

    public Scholarship(String title, String providerName, String scholarshipType, BigDecimal awardAmount,
                       String eligibilityCriteria, String applicableCourses, LocalDate applicationDeadline,
                       String officialLink, String requiredDocuments) {
        this.title = title;
        this.providerName = providerName;
        this.scholarshipType = scholarshipType;
        this.awardAmount = awardAmount;
        this.eligibilityCriteria = eligibilityCriteria;
        this.applicableCourses = applicableCourses;
        this.applicationDeadline = applicationDeadline;
        this.officialLink = officialLink;
        this.requiredDocuments = requiredDocuments;
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

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getScholarshipType() {
        return scholarshipType;
    }

    public void setScholarshipType(String scholarshipType) {
        this.scholarshipType = scholarshipType;
    }

    public BigDecimal getAwardAmount() {
        return awardAmount;
    }

    public void setAwardAmount(BigDecimal awardAmount) {
        this.awardAmount = awardAmount;
    }

    public String getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(String eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }

    public String getApplicableCourses() {
        return applicableCourses;
    }

    public void setApplicableCourses(String applicableCourses) {
        this.applicableCourses = applicableCourses;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public String getOfficialLink() {
        return officialLink;
    }

    public void setOfficialLink(String officialLink) {
        this.officialLink = officialLink;
    }

    public String getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(String requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
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
