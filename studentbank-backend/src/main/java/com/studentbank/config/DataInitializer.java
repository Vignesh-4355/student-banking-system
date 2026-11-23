package com.studentbank.config;

import com.studentbank.entity.*;
import com.studentbank.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AccountRepository accountRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final MonthlyBudgetRepository budgetRepository;
    private final SavingsGoalRepository goalRepository;
    private final FeeReminderRepository feeRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final FinancialChallengeRepository challengeRepository;
    private final StudentRewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentProfileRepository studentProfileRepository,
                           AccountRepository accountRepository,
                           ExpenseCategoryRepository categoryRepository,
                           TransactionRepository transactionRepository,
                           MonthlyBudgetRepository budgetRepository,
                           SavingsGoalRepository goalRepository,
                           FeeReminderRepository feeRepository,
                           ScholarshipRepository scholarshipRepository,
                           FinancialChallengeRepository challengeRepository,
                           StudentRewardRepository rewardRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.feeRepository = feeRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.challengeRepository = challengeRepository;
        this.rewardRepository = rewardRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing StudentBank default database seed data...");

        // 1. Seed Categories
        Map<String, ExpenseCategory> catMap = seedCategories();

        // 2. Seed Scholarships
        seedScholarships();

        // 3. Seed Challenges
        seedChallenges();

        // 4. Seed Primary Demo Student (Rahul Sharma)
        seedDemoStudent(catMap);

        // 5. Seed Secondary Student (Priya Patel)
        seedSecondaryStudent(catMap);

        // 6. Ensure all existing registered students have starter transactions and budgets
        seedMissingTransactions(catMap);

        logger.info("Database seeding completed successfully with rich Indian student records!");
    }

    private void seedMissingTransactions(Map<String, ExpenseCategory> catMap) {
        List<User> students = userRepository.findAll();
        for (User u : students) {
            if (u.getRole() == Role.ROLE_STUDENT && transactionRepository.countByUserId(u.getId()) == 0) {
                Account acc = accountRepository.findByUserId(u.getId()).orElse(null);
                if (acc != null) {
                    LocalDateTime now = LocalDateTime.now();
                    ExpenseCategory foodCat = catMap.get("FOOD_CANTEEN");
                    ExpenseCategory booksCat = catMap.get("BOOKS_STATIONARY");
                    ExpenseCategory subsCat = catMap.get("SUBSCRIPTIONS");

                    List<Transaction> txs = List.of(
                            new Transaction(acc, u, null, "INCOME", new BigDecimal("6000.00"), new BigDecimal("6000.00"), "UPI", "Monthly Allowance", "College Allowance Deposit", now.minusDays(5)),
                            new Transaction(acc, u, foodCat, "EXPENSE", new BigDecimal("350.00"), new BigDecimal("5650.00"), "UPI", "Campus Canteen", "Lunch & Snacks", now.minusDays(3)),
                            new Transaction(acc, u, booksCat, "EXPENSE", new BigDecimal("600.00"), new BigDecimal("5050.00"), "CARD", "College Bookstore", "Books & Study Material", now.minusDays(2)),
                            new Transaction(acc, u, subsCat, "EXPENSE", new BigDecimal("199.00"), new BigDecimal("4851.00"), "NET_BANKING", "Digital Platform", "Course & Learning Subscription", now.minusHours(4))
                    );
                    transactionRepository.saveAll(txs);
                    acc.setBalance(new BigDecimal("4851.00"));
                    accountRepository.save(acc);

                    String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
                    if (foodCat != null) budgetRepository.save(new MonthlyBudget(u, foodCat, currentMonth, new BigDecimal("2500.00"), new BigDecimal("350.00")));
                    if (booksCat != null) budgetRepository.save(new MonthlyBudget(u, booksCat, currentMonth, new BigDecimal("1500.00"), new BigDecimal("600.00")));
                    if (subsCat != null) budgetRepository.save(new MonthlyBudget(u, subsCat, currentMonth, new BigDecimal("600.00"), new BigDecimal("199.00")));

                    goalRepository.save(new SavingsGoal(u, "Coding Laptop / Tech Fund", "Fund for college development environment", new BigDecimal("50000.00"), new BigDecimal("5000.00"), LocalDate.now().plusMonths(6), "TECH", new BigDecimal("5000.00")));
                    feeRepository.save(new FeeReminder(u, "TUITION", "Semester College Tuition Fee", new BigDecimal("35000.00"), BigDecimal.ZERO, LocalDate.now().plusDays(25), "Current Academic Year", "PENDING"));
                    rewardRepository.save(new StudentReward(u, "Welcome to StudentBank", "ONBOARDING", 100, "Completed registration & digital wallet setup", "Award"));
                }
            }
        }
    }

    private Map<String, ExpenseCategory> seedCategories() {
        Map<String, ExpenseCategory> map = new HashMap<>();
        String[][] categories = {
                {"Food & Canteen", "FOOD_CANTEEN", "Utensils", "#F59E0B"},
                {"Books & Stationary", "BOOKS_STATIONARY", "BookOpen", "#3B82F6"},
                {"College & Exam Fees", "COLLEGE_FEES", "GraduationCap", "#10B981"},
                {"Hostel & PG Rent", "HOSTEL_RENT", "Home", "#6366F1"},
                {"Travel & Metro", "TRAVEL_METRO", "Bus", "#EC4899"},
                {"Subscriptions & Tech", "SUBSCRIPTIONS", "Laptop", "#8B5CF6"},
                {"Entertainment & Outings", "ENTERTAINMENT", "Film", "#EF4444"},
                {"Healthcare & Medical", "HEALTHCARE", "HeartPulse", "#14B8A6"}
        };

        for (String[] cat : categories) {
            ExpenseCategory existing = categoryRepository.findByCode(cat[1]).orElse(null);
            if (existing == null) {
                ExpenseCategory created = new ExpenseCategory(cat[0], cat[1], cat[2], cat[3], false, null);
                created = categoryRepository.save(created);
                map.put(cat[1], created);
            } else {
                map.put(cat[1], existing);
            }
        }
        return map;
    }

    private void seedScholarships() {
        if (scholarshipRepository.count() == 0) {
            List<Scholarship> list = List.of(
                    new Scholarship(
                            "Central Sector Scheme of Scholarship for College Students",
                            "Ministry of Education, Govt. of India",
                            "GOVERNMENT",
                            new BigDecimal("20000.00"),
                            "Top 20th percentile in Class 12 board exams, enrolled in regular graduation",
                            "B.Tech, B.Sc, B.Com, MBBS, BA",
                            LocalDate.now().plusMonths(2),
                            "https://scholarships.gov.in",
                            "Class 12 Marksheet, Income Certificate, Aadhar Card, College Bonafide"
                    ),
                    new Scholarship(
                            "Reliance Foundation Undergraduate Scholarship",
                            "Reliance Foundation",
                            "PRIVATE",
                            new BigDecimal("50000.00"),
                            "First-year undergraduate students in any stream with minimum 60% in Class 12",
                            "All Degree Programs",
                            LocalDate.now().plusMonths(1),
                            "https://reliancefoundation.org",
                            "Class 12 Marksheet, Family Income Proof, Bonafide Letter, Entrance Exam Scorecard"
                    ),
                    new Scholarship(
                            "Post-Matric Scholarship Scheme for Minorities",
                            "Ministry of Minority Affairs",
                            "GOVERNMENT",
                            new BigDecimal("30000.00"),
                            "Minimum 50% marks in previous final exam and family income within limits",
                            "Engineering, Medicine, Arts, Science, Commerce",
                            LocalDate.now().plusWeeks(6),
                            "https://scholarships.gov.in",
                            "Previous Exam Marksheet, Domicile Certificate, Minority Certificate, Bank Passbook"
                    ),
                    new Scholarship(
                            "Tata Trusts Means-Grant for College Students",
                            "Tata Trusts",
                            "PRIVATE",
                            new BigDecimal("40000.00"),
                            "Students enrolled in recognized Indian universities demonstrating financial hardship",
                            "Undergraduate & Postgraduate",
                            LocalDate.now().plusMonths(3),
                            "https://tatatrusts.org",
                            "College ID, Fee Receipts, Income Certificate, Statement of Purpose"
                    ),
                    new Scholarship(
                            "AICTE Pragati Scholarship Scheme for Girl Students",
                            "AICTE, Govt. of India",
                            "GOVERNMENT",
                            new BigDecimal("50000.00"),
                            "Female students admitted to first year of Degree Level course in AICTE approved institution",
                            "Technical Degree Courses",
                            LocalDate.now().plusMonths(2),
                            "https://aicte-india.org",
                            "AICTE Admission Letter, Caste Certificate, Income Proof, Aadhar"
                    )
            );
            scholarshipRepository.saveAll(list);
        }
    }

    private void seedChallenges() {
        if (challengeRepository.count() == 0) {
            List<FinancialChallenge> list = List.of(
                    new FinancialChallenge("30-Day ₹50 Daily Habit", "Save just ₹50 into your emergency goal every day for 30 consecutive days.", "30_DAY_SAVINGS", 30, 250, new BigDecimal("1500.00"), "Consistency Champion"),
                    new FinancialChallenge("No Swiggy / Zomato Week", "Cook or eat in the college canteen for 7 full days to curtail unnecessary weekend delivery splurges.", "NO_SWIGGY_WEEK", 7, 150, new BigDecimal("1200.00"), "Canteen Connoisseur"),
                    new FinancialChallenge("Roommate Budget Matcher", "Stay under your shared room budget limit for an entire monthly cycle.", "BUDGET_STREAK", 30, 300, new BigDecimal("2000.00"), "Budget Wizard"),
                    new FinancialChallenge("First ₹10,000 Milestone", "Accumulate a verified total savings balance of ₹10,000 in your StudentBank goal vaults.", "SAVINGS_MILESTONE", 60, 500, new BigDecimal("10000.00"), "Vault Master")
            );
            challengeRepository.saveAll(list);
        }
    }

    private void seedDemoStudent(Map<String, ExpenseCategory> catMap) {
        String email = "rahul.sharma@iitb.ac.in";
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setPublicId(UUID.randomUUID().toString());
            user.setEmail(email);
            user.setFullName("Rahul Sharma");
            user.setPasswordHash(passwordEncoder.encode("Student@123"));
            user.setPhoneNumber("9876543210");
            user.setRole(Role.ROLE_STUDENT);
            user.setIsActive(true);
            user.setIsEmailVerified(true);
            user.setTwoFactorEnabled(false);
            user = userRepository.save(user);

            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setStudentIdNumber("210050012");
            profile.setUniversityName("IIT Bombay - Indian Institute of Technology");
            profile.setCollegeName("Main Campus, Powai");
            profile.setCourseName("B.Tech - Computer Science & Engineering");
            profile.setDepartment("Computer Science & Engineering");
            profile.setAcademicYear("3rd Year");
            profile.setSemester(5);
            profile.setState("Maharashtra");
            profile.setCity("Mumbai");
            profile.setMonthlyAllowance(new BigDecimal("6000.00"));
            studentProfileRepository.save(profile);

            Account account = new Account();
            account.setUser(user);
            account.setAccountNumber("SB20268849102");
            account.setAccountType("STUDENT_WALLET");
            account.setBalance(new BigDecimal("4850.00"));
            account.setCurrency("INR");
            account.setUpiId("rahul.sharma@studentbank");
            account.setQrCodeToken(UUID.randomUUID().toString());
            account.setDailySpendLimit(new BigDecimal("5000.00"));
            account.setMonthlySpendLimit(new BigDecimal("30000.00"));
            account.setStatus("ACTIVE");
            accountRepository.save(account);
        }

        // Now ensure transactions, budgets, goals, fees, rewards exist!
        Account userAccount = accountRepository.findByUserId(user.getId()).orElse(null);
        if (userAccount != null && transactionRepository.countByUserId(user.getId()) == 0) {
            LocalDateTime now = LocalDateTime.now();

            // Set balanced realistic wallet
            userAccount.setBalance(new BigDecimal("4850.00"));
            accountRepository.save(userAccount);

            // Transactions
            List<Transaction> txs = List.of(
                    new Transaction(userAccount, user, null, "INCOME", new BigDecimal("6000.00"), new BigDecimal("6000.00"), "UPI", "Parents / Bank Transfer", "Monthly College Allowance", now.minusDays(18)),
                    new Transaction(userAccount, user, catMap.get("FOOD_CANTEEN"), "EXPENSE", new BigDecimal("120.00"), new BigDecimal("5880.00"), "UPI", "Hostel 12 Canteen", "Lunch & Cold Coffee", now.minusDays(15)),
                    new Transaction(userAccount, user, catMap.get("BOOKS_STATIONARY"), "EXPENSE", new BigDecimal("650.00"), new BigDecimal("5230.00"), "CARD", "Powai Book Depot", "Algorithms Textbook & Lab Notebooks", now.minusDays(12)),
                    new Transaction(userAccount, user, catMap.get("TRAVEL_METRO"), "EXPENSE", new BigDecimal("380.00"), new BigDecimal("4850.00"), "UPI", "Mumbai Metro Card", "Monthly Metro Recharge", now.minusDays(9)),
                    new Transaction(userAccount, user, catMap.get("FOOD_CANTEEN"), "EXPENSE", new BigDecimal("480.00"), new BigDecimal("4370.00"), "UPI", "Swiggy India", "Weekend Pizza with Hostel Roommates", now.minusDays(6)),
                    new Transaction(userAccount, user, catMap.get("SUBSCRIPTIONS"), "EXPENSE", new BigDecimal("59.00"), new BigDecimal("4311.00"), "NET_BANKING", "Spotify India", "Spotify Student Premium Plan", now.minusDays(4)),
                    new Transaction(userAccount, user, null, "INCOME", new BigDecimal("1200.00"), new BigDecimal("5511.00"), "UPI", "Peer Tutoring", "Java Programming Mentorship Payment", now.minusDays(2)),
                    new Transaction(userAccount, user, catMap.get("FOOD_CANTEEN"), "EXPENSE", new BigDecimal("661.00"), new BigDecimal("4850.00"), "UPI", "Campus Cafe Bistro", "Snacks & Group Study Refreshments", now.minusHours(6))
            );
            transactionRepository.saveAll(txs);

            // Budgets for current month
            String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
            List<MonthlyBudget> budgets = List.of(
                    new MonthlyBudget(user, catMap.get("FOOD_CANTEEN"), currentMonth, new BigDecimal("3500.00"), new BigDecimal("1850.00")),
                    new MonthlyBudget(user, catMap.get("BOOKS_STATIONARY"), currentMonth, new BigDecimal("1500.00"), new BigDecimal("650.00")),
                    new MonthlyBudget(user, catMap.get("TRAVEL_METRO"), currentMonth, new BigDecimal("1000.00"), new BigDecimal("380.00")),
                    new MonthlyBudget(user, catMap.get("SUBSCRIPTIONS"), currentMonth, new BigDecimal("500.00"), new BigDecimal("250.00"))
            );
            budgetRepository.saveAll(budgets);

            // Savings Goals
            List<SavingsGoal> goals = List.of(
                    new SavingsGoal(user, "MacBook M3 / Coding Laptop", "Upgrading for AI and Distributed Systems projects", new BigDecimal("65000.00"), new BigDecimal("28000.00"), LocalDate.now().plusMonths(6), "GADGET", new BigDecimal("6000.00")),
                    new SavingsGoal(user, "Emergency Student Vault", "For urgent medical or sudden travel expenses", new BigDecimal("10000.00"), new BigDecimal("6500.00"), LocalDate.now().plusMonths(3), "EMERGENCY", new BigDecimal("1500.00")),
                    new SavingsGoal(user, "Semester Break Goa Trip", "Hostel wing annual graduation trip", new BigDecimal("12000.00"), new BigDecimal("8500.00"), LocalDate.now().plusMonths(2), "TRAVEL", new BigDecimal("2000.00"))
            );
            goalRepository.saveAll(goals);

            // Fee Reminders
            List<FeeReminder> fees = List.of(
                    new FeeReminder(user, "TUITION", "Semester 5 Tuition Fee", new BigDecimal("45000.00"), BigDecimal.ZERO, LocalDate.now().plusDays(25), "Semester 5 (2026-27)", "PENDING"),
                    new FeeReminder(user, "HOSTEL", "Hostel & Mess Charges", new BigDecimal("24000.00"), new BigDecimal("24000.00"), LocalDate.now().minusDays(10), "Semester 5 (2026-27)", "PAID"),
                    new FeeReminder(user, "EXAMINATION", "Mid-Semester Examination Fee", new BigDecimal("2200.00"), BigDecimal.ZERO, LocalDate.now().plusDays(40), "Semester 5 (2026-27)", "PENDING")
            );
            feeRepository.saveAll(fees);

            // Rewards
            List<StudentReward> rewards = List.of(
                    new StudentReward(user, "Smart Budget Master", "BUDGET_MASTER", 200, "Maintained less than 80% budget consumption for 2 consecutive cycles", "Award"),
                    new StudentReward(user, "Early Bird Saver", "SAVER", 150, "Contributed regularly to the Laptop Goal without interruption", "Zap")
            );
            rewardRepository.saveAll(rewards);
        }
    }

    private void seedSecondaryStudent(Map<String, ExpenseCategory> catMap) {
        String email = "priya.patel@bits.ac.in";
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setPublicId(UUID.randomUUID().toString());
            user.setEmail(email);
            user.setFullName("Priya Patel");
            user.setPasswordHash(passwordEncoder.encode("Student@123"));
            user.setPhoneNumber("9823011223");
            user.setRole(Role.ROLE_STUDENT);
            user.setIsActive(true);
            user.setIsEmailVerified(true);
            user = userRepository.save(user);

            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setStudentIdNumber("2023A7PS0123P");
            profile.setUniversityName("BITS Pilani");
            profile.setCollegeName("Pilani Campus, Rajasthan");
            profile.setCourseName("B.E. (Hons) - Electronics & Communication");
            profile.setDepartment("Electrical & Electronics");
            profile.setAcademicYear("2nd Year");
            profile.setSemester(4);
            profile.setState("Rajasthan");
            profile.setCity("Pilani");
            profile.setMonthlyAllowance(new BigDecimal("7000.00"));
            studentProfileRepository.save(profile);

            Account account = new Account();
            account.setUser(user);
            account.setAccountNumber("SB20267739182");
            account.setAccountType("STUDENT_WALLET");
            account.setBalance(new BigDecimal("5200.00"));
            account.setCurrency("INR");
            account.setUpiId("priya.patel@studentbank");
            account.setQrCodeToken(UUID.randomUUID().toString());
            account.setDailySpendLimit(new BigDecimal("5000.00"));
            account.setMonthlySpendLimit(new BigDecimal("30000.00"));
            account.setStatus("ACTIVE");
            accountRepository.save(account);
        }

        Account userAccount = accountRepository.findByUserId(user.getId()).orElse(null);
        if (userAccount != null && transactionRepository.countByUserId(user.getId()) == 0) {
            LocalDateTime now = LocalDateTime.now();
            List<Transaction> txs = List.of(
                    new Transaction(userAccount, user, null, "INCOME", new BigDecimal("7000.00"), new BigDecimal("7000.00"), "UPI", "Parents / Stipend", "Monthly College Allowance", now.minusDays(10)),
                    new Transaction(userAccount, user, catMap.get("FOOD_CANTEEN"), "EXPENSE", new BigDecimal("450.00"), new BigDecimal("6550.00"), "UPI", "BITS Cafeteria", "Breakfast & Snacks", now.minusDays(8)),
                    new Transaction(userAccount, user, catMap.get("BOOKS_STATIONARY"), "EXPENSE", new BigDecimal("850.00"), new BigDecimal("5700.00"), "CARD", "Campus Stationery", "Sem 4 Lab Manuals", now.minusDays(5)),
                    new Transaction(userAccount, user, catMap.get("TRAVEL_METRO"), "EXPENSE", new BigDecimal("500.00"), new BigDecimal("5200.00"), "UPI", "Bus Travel", "Bus Pass Recharge", now.minusDays(2))
            );
            transactionRepository.saveAll(txs);

            String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
            budgetRepository.save(new MonthlyBudget(user, catMap.get("FOOD_CANTEEN"), currentMonth, new BigDecimal("3000.00"), new BigDecimal("450.00")));
            budgetRepository.save(new MonthlyBudget(user, catMap.get("BOOKS_STATIONARY"), currentMonth, new BigDecimal("1500.00"), new BigDecimal("850.00")));
            budgetRepository.save(new MonthlyBudget(user, catMap.get("TRAVEL_METRO"), currentMonth, new BigDecimal("1000.00"), new BigDecimal("500.00")));

            goalRepository.save(new SavingsGoal(user, "iPad Air for Digital Notes", "Apple iPad with Pencil for lecture diagrams", new BigDecimal("45000.00"), new BigDecimal("9000.00"), LocalDate.now().plusMonths(5), "TECH", new BigDecimal("4000.00")));
            feeRepository.save(new FeeReminder(user, "TUITION", "Semester 4 BITS Tuition", new BigDecimal("60000.00"), BigDecimal.ZERO, LocalDate.now().plusDays(20), "Academic Year 2026-27", "PENDING"));
            rewardRepository.save(new StudentReward(user, "Active Learner", "STUDENT", 150, "Enrolled in 4 semester modules", "Award"));
        }

        // Also seed Admin account if not present
        if (!userRepository.existsByEmail("admin@studentbank.com")) {
            User admin = new User();
            admin.setPublicId(UUID.randomUUID().toString());
            admin.setEmail("admin@studentbank.com");
            admin.setFullName("Platform Administrator");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setPhoneNumber("9999999999");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setIsActive(true);
            admin.setIsEmailVerified(true);
            userRepository.save(admin);
        }
    }
}
