package com.studentbank.dto;

import java.math.BigDecimal;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String publicId;
    private String email;
    private String fullName;
    private String role;
    private Boolean isEmailVerified;
    private Boolean twoFactorEnabled;
    private String accountNumber;
    private String upiId;
    private BigDecimal walletBalance;
    private String collegeName;

    public AuthResponse() {
    }

    public AuthResponse(String token, String publicId, String email, String fullName, String role,
                        Boolean isEmailVerified, Boolean twoFactorEnabled, String accountNumber,
                        String upiId, BigDecimal walletBalance, String collegeName) {
        this.token = token;
        this.publicId = publicId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.isEmailVerified = isEmailVerified;
        this.twoFactorEnabled = twoFactorEnabled;
        this.accountNumber = accountNumber;
        this.upiId = upiId;
        this.walletBalance = walletBalance;
        this.collegeName = collegeName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(Boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public BigDecimal getWalletBalance() {
        return walletBalance;
    }

    public void setWalletBalance(BigDecimal walletBalance) {
        this.walletBalance = walletBalance;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }
}
