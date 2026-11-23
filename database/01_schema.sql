-- ============================================================================
-- STUDENTBANK - DATABASE SCHEMA (MySQL 8.0+)
-- Complete Enterprise Schema for Student Financial Management Platform
-- ============================================================================

CREATE DATABASE IF NOT EXISTS studentbank_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE studentbank_db;

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE (Core authentication table)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(36) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_STUDENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    otp_code VARCHAR(10) NULL,
    otp_expiry_time DATETIME NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    transaction_pin VARCHAR(255) NULL,
    profile_image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. STUDENT PROFILES (Academic and institution details)
DROP TABLE IF EXISTS student_profiles;
CREATE TABLE student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    student_id_number VARCHAR(50) NOT NULL,
    university_name VARCHAR(150) NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL, -- e.g., '1st Year', '2nd Year', '3rd Year', 'Final Year'
    semester INT NOT NULL DEFAULT 1,
    date_of_birth DATE NULL,
    emergency_contact VARCHAR(15) NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Karnataka',
    city VARCHAR(50) NOT NULL DEFAULT 'Bengaluru',
    monthly_allowance DECIMAL(12, 2) NOT NULL DEFAULT 5000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profile_university (university_name),
    INDEX idx_profile_student_id (student_id_number)
) ENGINE=InnoDB;

-- 3. ACCOUNTS (Digital Student Wallet & Simulated Account)
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE,
    account_type VARCHAR(20) NOT NULL DEFAULT 'STUDENT_WALLET', -- STUDENT_WALLET, SAVINGS_SIMULATOR
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    upi_id VARCHAR(50) NOT NULL UNIQUE,
    qr_code_token VARCHAR(100) NOT NULL UNIQUE,
    daily_spend_limit DECIMAL(12, 2) NOT NULL DEFAULT 5000.00,
    monthly_spend_limit DECIMAL(12, 2) NOT NULL DEFAULT 30000.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, FROZEN, SUSPENDED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_balance CHECK (balance >= 0.00),
    CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_account_num (account_number),
    INDEX idx_upi_id (upi_id)
) ENGINE=InnoDB;

-- 4. EXPENSE CATEGORIES
DROP TABLE IF EXISTS expense_categories;
CREATE TABLE expense_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'Tag',
    color_hex VARCHAR(10) NOT NULL DEFAULT '#2563EB',
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cat_code (code)
) ENGINE=InnoDB;

-- 5. TRANSACTIONS
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_id VARCHAR(36) NOT NULL UNIQUE,
    account_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    category_id BIGINT NULL,
    transaction_type VARCHAR(10) NOT NULL, -- 'INCOME' or 'EXPENSE' or 'TRANSFER'
    amount DECIMAL(12, 2) NOT NULL,
    balance_after DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    payment_mode VARCHAR(20) NOT NULL DEFAULT 'UPI', -- UPI, QR_CODE, CARD, CASH, NET_BANKING, MOCK_WALLET
    merchant_name VARCHAR(100) NULL,
    description VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, PENDING, FAILED, REVERSED
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    receipt_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_trans_amount CHECK (amount > 0.00),
    CONSTRAINT fk_trans_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_trans_category FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL,
    INDEX idx_trans_user_date (user_id, transaction_date),
    INDEX idx_trans_ref (reference_id)
) ENGINE=InnoDB;

-- 6. MONTHLY BUDGETS
DROP TABLE IF EXISTS monthly_budgets;
CREATE TABLE monthly_budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NULL,
    month_year VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    allocated_amount DECIMAL(12, 2) NOT NULL,
    spent_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    alert_threshold_percentage INT NOT NULL DEFAULT 80,
    is_alert_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_budget_category FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_month_category (user_id, month_year, category_id),
    INDEX idx_budget_lookup (user_id, month_year)
) ENGINE=InnoDB;

-- 7. SAVINGS GOALS
DROP TABLE IF EXISTS savings_goals;
CREATE TABLE savings_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    saved_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    target_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GADGET', -- GADGET, EDUCATION, EMERGENCY, TRAVEL, VEHICLE, OTHER
    monthly_installment DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, ACHIEVED, CANCELLED
    icon VARCHAR(50) NOT NULL DEFAULT 'Target',
    color_hex VARCHAR(10) NOT NULL DEFAULT '#0D9488',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_target_amount CHECK (target_amount > 0.00),
    CONSTRAINT fk_goal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_goal_user (user_id, status)
) ENGINE=InnoDB;

-- 8. SCHOLARSHIPS
DROP TABLE IF EXISTS scholarships;
CREATE TABLE scholarships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    scholarship_type VARCHAR(30) NOT NULL, -- GOVERNMENT, PRIVATE, INSTITUTIONAL, INTERNATIONAL
    award_amount DECIMAL(12, 2) NOT NULL,
    eligibility_criteria TEXT NOT NULL,
    applicable_courses TEXT NOT NULL,
    min_cgpa DECIMAL(3, 2) NULL,
    max_family_income DECIMAL(12, 2) NULL,
    application_deadline DATE NOT NULL,
    official_link VARCHAR(500) NOT NULL,
    required_documents TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_schol_type (scholarship_type),
    INDEX idx_schol_deadline (application_deadline)
) ENGINE=InnoDB;

-- 9. SCHOLARSHIP APPLICATIONS
DROP TABLE IF EXISTS scholarship_applications;
CREATE TABLE scholarship_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    submission_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED
    documents_submitted_json TEXT NULL,
    notes VARCHAR(500) NULL,
    disbursed_amount DECIMAL(12, 2) NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appl_scholarship FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE RESTRICT,
    CONSTRAINT fk_appl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_appl_user (user_id)
) ENGINE=InnoDB;

-- 10. FEE REMINDERS
DROP TABLE IF EXISTS fee_reminders;
CREATE TABLE fee_reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    fee_type VARCHAR(50) NOT NULL, -- TUITION, HOSTEL, MESS, EXAMINATION, LIBRARY, TRANSPORT, OTHER
    title VARCHAR(150) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    academic_term VARCHAR(50) NOT NULL, -- e.g., 'Semester 5 (2026-27)'
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, PARTIALLY_PAID, PAID, OVERDUE
    receipt_number VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fee_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_fee_user (user_id, status)
) ENGINE=InnoDB;

-- 11. NOTIFICATIONS
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL, -- BUDGET_ALERT, FEE_DUE, SCHOLARSHIP_DEADLINE, TRANSACTION_ALERT, SYSTEM
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user_unread (user_id, is_read)
) ENGINE=InnoDB;

-- 12. FINANCIAL CHALLENGES
DROP TABLE IF EXISTS financial_challenges;
CREATE TABLE financial_challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    challenge_type VARCHAR(30) NOT NULL, -- 30_DAY_SAVINGS, NO_SWIGGY_WEEK, ₹50_DAILY_SAVE, BUDGET_STREAK
    duration_days INT NOT NULL,
    reward_points INT NOT NULL DEFAULT 100,
    target_savings DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    badge_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. CHAT HISTORY (AI Financial Assistant)
DROP TABLE IF EXISTS chat_history;
CREATE TABLE chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(50) NOT NULL,
    user_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    tokens_used INT NULL DEFAULT 0,
    intent_detected VARCHAR(50) NULL, -- SAVINGS_ADVICE, EXPENSE_QUERY, BUDGET_HELP, SCHOLARSHIP_SEARCH, GENERAL_LITERACY
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_user_session (user_id, session_id)
) ENGINE=InnoDB;

-- 14. STUDENT REWARDS (Badges, Cashbacks & Points)
DROP TABLE IF EXISTS student_rewards;
CREATE TABLE student_rewards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_title VARCHAR(100) NOT NULL,
    badge_category VARCHAR(50) NOT NULL, -- SAVER, BUDGET_MASTER, SCHOLAR, SPLIT_PRO, FINANCIAL_LITERACY
    points_awarded INT NOT NULL DEFAULT 50,
    description VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'Award',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reward_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reward_user (user_id)
) ENGINE=InnoDB;

-- 15. SECURITY LOGS
DROP TABLE IF EXISTS security_logs;
CREATE TABLE security_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    event_type VARCHAR(50) NOT NULL, -- LOGIN_SUCCESS, LOGIN_FAILED, PASSWORD_RESET, PIN_CHANGED, SUSPICIOUS_ATTEMPT
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    device_info VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, BLOCKED, WARNING
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sec_user (user_id),
    INDEX idx_sec_event (event_type)
) ENGINE=InnoDB;

-- 16. SUBSCRIPTIONS
DROP TABLE IF EXISTS subscriptions;
CREATE TABLE subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    service_name VARCHAR(100) NOT NULL, -- Spotify Student, GitHub Copilot, Amazon Prime Student, Netflix, Notion
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'MONTHLY', -- MONTHLY, QUARTERLY, ANNUAL
    cost DECIMAL(12, 2) NOT NULL,
    next_billing_date DATE NOT NULL,
    student_discount_applied BOOLEAN NOT NULL DEFAULT TRUE,
    category_id BIGINT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_cat FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL,
    INDEX idx_sub_user (user_id)
) ENGINE=InnoDB;

-- 17. SHARED EXPENSES (Roommate and Group bill splitter)
DROP TABLE IF EXISTS shared_expenses;
CREATE TABLE shared_expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_by_user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL, -- e.g. "Apartment Wi-Fi & Groceries"
    total_amount DECIMAL(12, 2) NOT NULL,
    split_method VARCHAR(20) NOT NULL DEFAULT 'EQUAL', -- EQUAL, PERCENTAGE, EXACT
    group_name VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SETTLED
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shared_owner FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_shared_creator (created_by_user_id)
) ENGINE=InnoDB;

-- 18. PAYMENTS (Gateway and Mock UPI Transfers)
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    recipient_upi VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    fee_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    gateway_provider VARCHAR(50) NOT NULL DEFAULT 'STUDENTBANK_MOCK_PAY',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, PENDING, FAILED
    payment_method VARCHAR(30) NOT NULL DEFAULT 'UPI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_pay_ref (transaction_reference)
) ENGINE=InnoDB;

-- 19. ADMIN USERS
DROP TABLE IF EXISTS admin_users;
CREATE TABLE admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    admin_level VARCHAR(30) NOT NULL DEFAULT 'MODERATOR', -- SUPER_ADMIN, MODERATOR, SCHOLARSHIP_OFFICER
    department VARCHAR(100) NOT NULL DEFAULT 'FinTech Oversight',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
