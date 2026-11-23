-- ============================================================================
-- STUDENTBANK - SEED DATA (Realistic Indian Student Context)
-- ============================================================================

USE studentbank_db;

-- 1. Default Expense Categories (Standard Student Categories)
INSERT INTO expense_categories (id, name, code, icon, color_hex, is_custom, user_id) VALUES
(1, 'Food & Canteen', 'FOOD_CANTEEN', 'Utensils', '#F59E0B', FALSE, NULL),
(2, 'Books & Stationary', 'BOOKS_STATIONARY', 'BookOpen', '#3B82F6', FALSE, NULL),
(3, 'College & Exam Fees', 'COLLEGE_FEES', 'GraduationCap', '#10B981', FALSE, NULL),
(4, 'Hostel & PG Rent', 'HOSTEL_RENT', 'Home', '#6366F1', FALSE, NULL),
(5, 'Travel & Metro', 'TRAVEL_METRO', 'Bus', '#EC4899', FALSE, NULL),
(6, 'Subscriptions & Tech', 'SUBSCRIPTIONS', 'Laptop', '#8B5CF6', FALSE, NULL),
(7, 'Entertainment & Outings', 'ENTERTAINMENT', 'Film', '#EF4444', FALSE, NULL),
(8, 'Healthcare & Medical', 'HEALTHCARE', 'HeartPulse', '#14B8A6', FALSE, NULL),
(9, 'Personal Care', 'PERSONAL_CARE', 'Smile', '#84CC16', FALSE, NULL),
(10, 'General & Miscellaneous', 'MISCELLANEOUS', 'Tag', '#64748B', FALSE, NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Scholarships (Indian National & Private Schemes)
INSERT INTO scholarships (id, title, provider_name, scholarship_type, award_amount, eligibility_criteria, applicable_courses, min_cgpa, max_family_income, application_deadline, official_link, required_documents, is_active) VALUES
(1, 'Central Sector Scheme of Scholarship for College and University Students', 'Ministry of Education, Govt. of India', 'GOVERNMENT', 20000.00, 'Top 20th percentile in Class 12 board exams, enrolled in regular graduation course', 'B.Tech, B.Sc, B.Com, MBBS, BA', 8.00, 450000.00, '2026-12-31', 'https://scholarships.gov.in', 'Class 12 Marks Sheet, Income Certificate, Aadhar Card, College Bonafide', TRUE),
(2, 'Reliance Foundation Undergraduate Scholarships', 'Reliance Foundation', 'PRIVATE', 50000.00, 'First-year undergraduate students in any stream with minimum 60% in Class 12', 'All Degree Programs', 7.50, 600000.00, '2026-11-30', 'https://reliancefoundation.org', 'Class 12 Marksheet, Family Income Proof, Bonafide Letter, Entrance Exam Scorecard', TRUE),
(3, 'Post-Matric Scholarship Scheme for Minorities', 'Ministry of Minority Affairs', 'GOVERNMENT', 30000.00, 'Minimum 50% marks in previous final exam and family income within limits', 'Engineering, Medicine, Arts, Science, Commerce', 7.00, 250000.00, '2026-12-15', 'https://scholarships.gov.in', 'Previous Exam Marksheet, Domicile Certificate, Minority Certificate, Bank Passbook', TRUE),
(4, 'Tata Trusts Means-Grant for College Students', 'Tata Trusts', 'PRIVATE', 40000.00, 'Students enrolled in recognised Indian universities demonstrating financial hardship', 'Undergraduate & Postgraduate', 7.80, 400000.00, '2027-01-15', 'https://tatatrusts.org', 'College ID, Fee Receipts, Income Certificate, Statement of Purpose', TRUE),
(5, 'AICTE Pragati Scholarship Scheme for Girl Students', 'AICTE, Govt. of India', 'GOVERNMENT', 50000.00, 'Female students admitted to first year of Degree Level course in AICTE approved institution', 'Technical Degree Courses', 7.50, 800000.00, '2026-12-20', 'https://aicte-india.org', 'AICTE Admission Letter, Caste Certificate (if applicable), Income Proof, Aadhar', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. Predefined Financial Challenges
INSERT INTO financial_challenges (id, title, description, challenge_type, duration_days, reward_points, target_savings, badge_name, is_active) VALUES
(1, '30-Day ₹50 Daily Habit', 'Save just ₹50 into your emergency goal every day for 30 consecutive days.', '30_DAY_SAVINGS', 30, 250, 1500.00, 'Consistency Champion', TRUE),
(2, 'No Swiggy / Zomato Week', 'Cook or eat in the college canteen for 7 full days to curtail unnecessary weekend delivery splurges.', 'NO_SWIGGY_WEEK', 7, 150, 1200.00, 'Canteen Connoisseur', TRUE),
(3, 'Roommate Budget Matcher', 'Stay under your shared room budget limit for an entire monthly cycle.', 'BUDGET_STREAK', 30, 300, 2000.00, 'Budget Wizard', TRUE),
(4, 'First ₹10,000 Milestone', 'Accumulate a verified total savings balance of ₹10,000 in your StudentBank goal vaults.', 'SAVINGS_MILESTONE', 60, 500, 10000.00, 'Vault Master', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);
