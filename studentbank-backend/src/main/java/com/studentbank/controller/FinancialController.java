package com.studentbank.controller;

import com.studentbank.dto.ApiResponse;
import com.studentbank.entity.*;
import com.studentbank.exception.ResourceNotFoundException;
import com.studentbank.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/finance")
public class FinancialController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final StudentProfileRepository profileRepository;
    private final TransactionRepository transactionRepository;
    private final MonthlyBudgetRepository budgetRepository;
    private final SavingsGoalRepository goalRepository;
    private final FeeReminderRepository feeRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final FinancialChallengeRepository challengeRepository;
    private final StudentRewardRepository rewardRepository;
    private final ExpenseCategoryRepository categoryRepository;

    public FinancialController(UserRepository userRepository,
                               AccountRepository accountRepository,
                               StudentProfileRepository profileRepository,
                               TransactionRepository transactionRepository,
                               MonthlyBudgetRepository budgetRepository,
                               SavingsGoalRepository goalRepository,
                               FeeReminderRepository feeRepository,
                               ScholarshipRepository scholarshipRepository,
                               FinancialChallengeRepository challengeRepository,
                               StudentRewardRepository rewardRepository,
                               ExpenseCategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.profileRepository = profileRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.feeRepository = feeRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.challengeRepository = challengeRepository;
        this.rewardRepository = rewardRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardData(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        Account account = accountRepository.findByUserId(user.getId()).orElse(null);
        StudentProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        List<Transaction> transactions = transactionRepository.findTop10ByUserIdOrderByTransactionDateDesc(user.getId());
        LocalDateTime now = LocalDateTime.now();
        String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
        List<MonthlyBudget> budgets = budgetRepository.findByUserIdAndMonthYear(user.getId(), currentMonth);
        if (budgets.isEmpty()) {
            budgets = budgetRepository.findByUserId(user.getId());
        }

        List<SavingsGoal> goals = goalRepository.findByUserIdOrderByTargetDateAsc(user.getId());
        List<FeeReminder> fees = feeRepository.findByUserIdOrderByDueDateAsc(user.getId());
        List<Scholarship> scholarships = scholarshipRepository.findByIsActiveTrueOrderByApplicationDeadlineAsc();
        List<FinancialChallenge> challenges = challengeRepository.findByIsActiveTrue();
        List<StudentReward> rewards = rewardRepository.findByUserIdOrderByUnlockedAtDesc(user.getId());

        // Calculate totals
        BigDecimal totalSpentThisMonth = BigDecimal.ZERO;
        for (MonthlyBudget b : budgets) {
            totalSpentThisMonth = totalSpentThisMonth.add(b.getSpentAmount());
        }

        BigDecimal totalSavings = BigDecimal.ZERO;
        for (SavingsGoal g : goals) {
            totalSavings = totalSavings.add(g.getSavedAmount());
        }

        Map<String, Object> data = new HashMap<>();
        data.put("fullName", user.getFullName());
        data.put("email", user.getEmail());
        data.put("collegeName", profile != null ? profile.getCollegeName() : "University");
        data.put("courseName", profile != null ? profile.getCourseName() : "Degree");
        data.put("academicYear", profile != null ? profile.getAcademicYear() : "1st Year");
        data.put("semester", profile != null ? profile.getSemester() : 1);
        data.put("monthlyAllowance", profile != null ? profile.getMonthlyAllowance() : new BigDecimal("5000.00"));
        data.put("walletBalance", account != null ? account.getBalance() : BigDecimal.ZERO);
        data.put("upiId", account != null ? account.getUpiId() : "student@studentbank");
        data.put("accountNumber", account != null ? account.getAccountNumber() : "N/A");
        data.put("totalSpentThisMonth", totalSpentThisMonth);
        data.put("totalSavings", totalSavings);

        data.put("recentTransactions", transactions.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("referenceId", t.getReferenceId());
            map.put("type", t.getTransactionType());
            map.put("amount", t.getAmount());
            map.put("balanceAfter", t.getBalanceAfter());
            map.put("merchant", t.getMerchantName());
            map.put("description", t.getDescription());
            map.put("paymentMode", t.getPaymentMode());
            map.put("date", t.getTransactionDate().toString());
            map.put("category", t.getCategory() != null ? t.getCategory().getName() : "General");
            map.put("categoryColor", t.getCategory() != null ? t.getCategory().getColorHex() : "#2563EB");
            return map;
        }).toList());

        data.put("budgets", budgets.stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("category", b.getCategory() != null ? b.getCategory().getName() : "General");
            map.put("allocated", b.getAllocatedAmount());
            map.put("spent", b.getSpentAmount());
            BigDecimal remaining = b.getAllocatedAmount().subtract(b.getSpentAmount());
            map.put("remaining", remaining.max(BigDecimal.ZERO));
            double pct = b.getAllocatedAmount().compareTo(BigDecimal.ZERO) > 0
                    ? b.getSpentAmount().doubleValue() / b.getAllocatedAmount().doubleValue() * 100.0
                    : 0.0;
            map.put("percentage", Math.min(100.0, Math.round(pct * 10.0) / 10.0));
            map.put("isAlert", b.getIsAlertTriggered());
            return map;
        }).toList());

        data.put("savingsGoals", goals.stream().map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("title", g.getTitle());
            map.put("description", g.getDescription());
            map.put("target", g.getTargetAmount());
            map.put("saved", g.getSavedAmount());
            map.put("targetDate", g.getTargetDate().toString());
            map.put("monthlyInstallment", g.getMonthlyInstallment());
            double pct = g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                    ? g.getSavedAmount().doubleValue() / g.getTargetAmount().doubleValue() * 100.0
                    : 0.0;
            map.put("percentage", Math.min(100.0, Math.round(pct * 10.0) / 10.0));
            return map;
        }).toList());

        data.put("feeReminders", fees.stream().map(f -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("title", f.getTitle());
            map.put("feeType", f.getFeeType());
            map.put("totalAmount", f.getTotalAmount());
            map.put("paidAmount", f.getPaidAmount());
            map.put("dueDate", f.getDueDate().toString());
            map.put("status", f.getStatus());
            map.put("term", f.getAcademicTerm());
            return map;
        }).toList());

        data.put("scholarships", scholarships.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("title", s.getTitle());
            map.put("provider", s.getProviderName());
            map.put("type", s.getScholarshipType());
            map.put("awardAmount", s.getAwardAmount());
            map.put("deadline", s.getApplicationDeadline().toString());
            map.put("officialLink", s.getOfficialLink());
            return map;
        }).toList());

        data.put("challenges", challenges.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("title", c.getTitle());
            map.put("description", c.getDescription());
            map.put("challengeType", c.getChallengeType());
            map.put("durationDays", c.getDurationDays());
            map.put("rewardPoints", c.getRewardPoints());
            map.put("targetSavings", c.getTargetSavings());
            map.put("badgeName", c.getBadgeName());
            return map;
        }).toList());

        data.put("rewards", rewards.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("badgeTitle", r.getBadgeTitle());
            map.put("badgeCategory", r.getBadgeCategory());
            map.put("pointsAwarded", r.getPointsAwarded());
            map.put("description", r.getDescription());
            map.put("iconName", r.getIconName());
            return map;
        }).toList());

        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved successfully", data));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<ExpenseCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categoryRepository.findAll()));
    }

    @PostMapping("/transactions")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> addTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> req) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student wallet not found"));

        String type = (String) req.getOrDefault("type", "EXPENSE");
        BigDecimal amount = new BigDecimal(req.get("amount").toString());
        String description = (String) req.getOrDefault("description", "Student Transaction");
        String merchant = (String) req.getOrDefault("merchant", description);
        String paymentMode = (String) req.getOrDefault("paymentMode", "UPI");
        String categoryCode = (String) req.get("categoryCode");

        ExpenseCategory category = null;
        if (categoryCode != null && !categoryCode.isBlank()) {
            category = categoryRepository.findByCode(categoryCode).orElse(null);
        }

        BigDecimal newBalance;
        if ("INCOME".equalsIgnoreCase(type)) {
            newBalance = account.getBalance().add(amount);
        } else {
            if (account.getBalance().compareTo(amount) < 0) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Insufficient wallet balance for this transaction"));
            }
            newBalance = account.getBalance().subtract(amount);
        }

        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction tx = new Transaction(
                account,
                user,
                category,
                type.toUpperCase(),
                amount,
                newBalance,
                paymentMode,
                merchant,
                description,
                LocalDateTime.now()
        );
        Transaction savedTx = transactionRepository.save(tx);

        if ("EXPENSE".equalsIgnoreCase(type) && category != null) {
            LocalDateTime now = LocalDateTime.now();
            String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
            List<MonthlyBudget> budgets = budgetRepository.findByUserIdAndMonthYear(user.getId(), currentMonth);
            for (MonthlyBudget b : budgets) {
                if (b.getCategory() != null && b.getCategory().getId().equals(category.getId())) {
                    b.setSpentAmount(b.getSpentAmount().add(amount));
                    if (b.getAllocatedAmount().compareTo(BigDecimal.ZERO) > 0 &&
                            b.getSpentAmount().compareTo(b.getAllocatedAmount().multiply(new BigDecimal("0.80"))) >= 0) {
                        b.setIsAlertTriggered(true);
                    }
                    budgetRepository.save(b);
                    break;
                }
            }
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("transactionId", savedTx.getId());
        resp.put("newBalance", newBalance);
        resp.put("referenceId", savedTx.getReferenceId());

        return ResponseEntity.ok(ApiResponse.success("Transaction recorded successfully", resp));
    }

    @PostMapping("/budgets")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> setBudget(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> req) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String categoryCode = (String) req.get("categoryCode");
        BigDecimal allocatedAmount = new BigDecimal(req.get("allocatedAmount").toString());

        ExpenseCategory category = categoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryCode));

        LocalDateTime now = LocalDateTime.now();
        String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
        List<MonthlyBudget> existing = budgetRepository.findByUserIdAndMonthYear(user.getId(), currentMonth);

        MonthlyBudget target = null;
        for (MonthlyBudget b : existing) {
            if (b.getCategory() != null && b.getCategory().getId().equals(category.getId())) {
                target = b;
                break;
            }
        }

        if (target != null) {
            target.setAllocatedAmount(allocatedAmount);
        } else {
            target = new MonthlyBudget(user, category, currentMonth, allocatedAmount, BigDecimal.ZERO);
        }
        budgetRepository.save(target);

        return ResponseEntity.ok(ApiResponse.success("Monthly budget configured successfully", Map.of("budgetId", target.getId(), "allocated", target.getAllocatedAmount())));
    }

    @PostMapping("/savings-goals")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> createSavingsGoal(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> req) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        String title = (String) req.get("title");
        String description = (String) req.getOrDefault("description", "Student Savings Goal");
        BigDecimal targetAmount = new BigDecimal(req.get("targetAmount").toString());
        BigDecimal initialDeposit = req.containsKey("initialDeposit") && req.get("initialDeposit") != null
                ? new BigDecimal(req.get("initialDeposit").toString()) : BigDecimal.ZERO;
        String category = (String) req.getOrDefault("category", "GADGET");
        int targetMonths = req.containsKey("targetMonths") ? Integer.parseInt(req.get("targetMonths").toString()) : 6;
        java.time.LocalDate targetDate = java.time.LocalDate.now().plusMonths(targetMonths);
        BigDecimal monthlyInstallment = targetAmount.divide(BigDecimal.valueOf(Math.max(1, targetMonths)), 2, java.math.RoundingMode.HALF_UP);

        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            if (account.getBalance().compareTo(initialDeposit) < 0) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Insufficient wallet balance for initial goal deposit"));
            }
            account.setBalance(account.getBalance().subtract(initialDeposit));
            accountRepository.save(account);

            Transaction tx = new Transaction(
                    account,
                    user,
                    null,
                    "EXPENSE",
                    initialDeposit,
                    account.getBalance(),
                    "WALLET_TRANSFER",
                    "Goal Vault: " + title,
                    "Seed deposit allocated into " + title,
                    LocalDateTime.now()
            );
            transactionRepository.save(tx);
        }

        SavingsGoal goal = new SavingsGoal(
                user,
                title,
                description,
                targetAmount,
                initialDeposit,
                targetDate,
                category,
                monthlyInstallment
        );
        SavingsGoal savedGoal = goalRepository.save(goal);

        return ResponseEntity.ok(ApiResponse.success("Savings Goal created successfully", Map.of("goalId", savedGoal.getId(), "saved", savedGoal.getSavedAmount())));
    }

    @PostMapping("/savings-goals/{id}/deposit")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> depositToGoal(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, Object> req) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized access to this savings vault"));
        }

        BigDecimal amount = new BigDecimal(req.get("amount").toString());
        if (account.getBalance().compareTo(amount) < 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Insufficient wallet balance"));
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        goal.setSavedAmount(goal.getSavedAmount().add(amount));
        if (goal.getSavedAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus("ACHIEVED");
        }
        goalRepository.save(goal);

        Transaction tx = new Transaction(
                account,
                user,
                null,
                "EXPENSE",
                amount,
                account.getBalance(),
                "WALLET_TRANSFER",
                "Goal Vault: " + goal.getTitle(),
                "Contribution towards " + goal.getTitle(),
                LocalDateTime.now()
        );
        transactionRepository.save(tx);

        return ResponseEntity.ok(ApiResponse.success("Deposit successful", Map.of(
                "savedAmount", goal.getSavedAmount(),
                "walletBalance", account.getBalance(),
                "status", goal.getStatus()
        )));
    }

    @PostMapping("/wallet/top-up")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> topUpWallet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> req) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        BigDecimal amount = new BigDecimal(req.get("amount").toString());
        String source = (String) req.getOrDefault("source", "Parents Bank Transfer / UPI");

        BigDecimal newBalance = account.getBalance().add(amount);
        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction tx = new Transaction(
                account,
                user,
                null,
                "INCOME",
                amount,
                newBalance,
                "UPI",
                source,
                "Wallet top-up via " + source,
                LocalDateTime.now()
        );
        transactionRepository.save(tx);

        return ResponseEntity.ok(ApiResponse.success("Wallet credited successfully", Map.of("newBalance", newBalance)));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<ApiResponse<Map<String, Object>>> askAiAssistant(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> req) {

        String query = req.getOrDefault("message", "").trim();
        String queryLower = query.toLowerCase();

        String answer;
        List<String> suggestions = new ArrayList<>();

        if (queryLower.contains("5000") || queryLower.contains("allowance")) {
            answer = "💡 **Student 50/30/20 Rule for ₹5,000 Allowance:**\n\n" +
                     "1. **Needs (₹2,500 - 50%)**: College canteen lunch, metro/bus transit passes, Xerox/lab printouts.\n" +
                     "2. **Wants (₹1,500 - 30%)**: Weekend outing with friends, OTT/Spotify student discounts.\n" +
                     "3. **Savings (₹1,000 - 20%)**: Park in your StudentBank Emergency Vault. In 1 academic year, you will accumulate ₹12,000!\n\n" +
                     "**Pro-Tip:** Pay via student discount ID cards to get flat 10-25% off food and book stores.";
            suggestions.add("How to reduce canteen expenses?");
            suggestions.add("Explain compound interest");
        } else if (queryLower.contains("save") && (queryLower.contains("2000") || queryLower.contains("2,000"))) {
            answer = "🎯 **Action Plan to Save ₹2,000 Monthly as a Student:**\n\n" +
                     "• **Cut Weekend Swiggy/Zomato Splurges**: 2 skipped deliveries saved ≈ ₹600 - ₹800.\n" +
                     "• **Switch to Monthly Student Metro/Bus Pass**: Saves up to ₹400 compared to individual tokens.\n" +
                     "• **Buy Second-Hand Textbooks or Use College Library**: Saves ₹500 on printouts and materials.\n" +
                     "• **Share Subscriptions**: Use family or student duo plans for Spotify/YouTube to save ₹150+.\n\n" +
                     "Automatically transfer ₹500 every Monday into your 'Tech Upgrade' goal vault!";
            suggestions.add("How should I manage my ₹5,000 allowance?");
            suggestions.add("What are good emergency funds for college?");
        } else if (queryLower.contains("compound") || queryLower.contains("interest") || queryLower.contains("sip")) {
            answer = "📈 **The Power of Compound Interest for Students:**\n\n" +
                     "Albert Einstein called compound interest the 8th wonder of the world: *'He who understands it, earns it; he who doesn't, pays it.'*\n\n" +
                     "**Real Student Example:**\n" +
                     "• If you invest just **₹500 per month** in an Index Fund (12% CAGR) starting at age 19:\n" +
                     "• At age 29 (10 years): You invested ₹60,000, but your wealth grows to **₹1,16,170**!\n" +
                     "• If you continue until age 40: You'll have over **₹5,00,000** from pocket money alone!";
            suggestions.add("How to start SIP with ₹500?");
            suggestions.add("What is UPI safety?");
        } else if (queryLower.contains("canteen") || queryLower.contains("food") || queryLower.contains("swiggy")) {
            answer = "🍔 **Smart Canteen & Food Savings Strategy:**\n\n" +
                     "1. **Set a Daily Canteen Cap of ₹80**: Stick to thali/meals rather than packaged drinks and chips.\n" +
                     "2. **Carry a Refillable Water Bottle**: Avoid buying ₹20 plastic bottles daily (saves ₹600/month!).\n" +
                     "3. **Join the StudentBank 'No Swiggy Week' Challenge**: Win 150 reward XP while saving ₹1,200!";
            suggestions.add("Tell me about scholarships");
            suggestions.add("How to split bills with roommates?");
        } else if (queryLower.contains("scholarship") || queryLower.contains("fee")) {
            answer = "🎓 **Scholarship Opportunity Spotlight:**\n\n" +
                     "• **Central Sector Scheme (NSP)**: ₹20,000/yr for top university rankers.\n" +
                     "• **Reliance Foundation Undergraduate**: Up to ₹2,00,000 for degree students.\n" +
                     "• **AICTE Pragati**: ₹50,000/yr for female technical degree scholars.\n\n" +
                     "Check the **Scholarships** card on your dashboard for application deadlines!";
            suggestions.add("How to apply for NSP?");
            suggestions.add("How to manage semester fees?");
        } else {
            answer = "🤖 **StudentBank AI Financial Advisor:**\n\n" +
                     "I'm here to help you optimize your university allowance, curb impulsive expenses, plan semester fees, and unlock savings goals.\n\n" +
                     "Feel free to ask me:\n" +
                     "• *'How should I budget ₹5,000?'*\n" +
                     "• *'How can I save ₹2,000 monthly?'*\n" +
                     "• *'Explain SIP and compounding'* \n" +
                     "• *'How to split room rent with roommates?'*";
            suggestions.add("How should I manage my ₹5,000 allowance?");
            suggestions.add("How can I save ₹2,000 monthly?");
            suggestions.add("Explain compound interest");
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("response", answer);
        resp.put("suggestions", suggestions);
        resp.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.success("AI response generated", resp));
    }
}
