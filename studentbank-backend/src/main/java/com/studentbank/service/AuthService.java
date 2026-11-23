package com.studentbank.service;

import com.studentbank.dto.*;
import com.studentbank.entity.*;
import com.studentbank.exception.BadRequestException;
import com.studentbank.exception.ResourceNotFoundException;
import com.studentbank.repository.*;
import com.studentbank.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AccountRepository accountRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final TransactionRepository transactionRepository;
    private final MonthlyBudgetRepository budgetRepository;
    private final SavingsGoalRepository goalRepository;
    private final FeeReminderRepository feeRepository;
    private final StudentRewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final SecurityLogService securityLogService;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       AccountRepository accountRepository,
                       ExpenseCategoryRepository expenseCategoryRepository,
                       TransactionRepository transactionRepository,
                       MonthlyBudgetRepository budgetRepository,
                       SavingsGoalRepository goalRepository,
                       FeeReminderRepository feeRepository,
                       StudentRewardRepository rewardRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       SecurityLogService securityLogService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.accountRepository = accountRepository;
        this.expenseCategoryRepository = expenseCategoryRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
        this.feeRepository = feeRepository;
        this.rewardRepository = rewardRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.securityLogService = securityLogService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists.");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("An account with mobile number " + request.getPhoneNumber() + " already exists.");
        }

        // 1. Create User
        User user = new User();
        user.setPublicId(UUID.randomUUID().toString());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setRole(Role.ROLE_STUDENT);
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setOtpCode("123456");
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(15));
        user.setTwoFactorEnabled(false);

        User savedUser = userRepository.save(user);

        // 2. Create Student Profile
        StudentProfile profile = new StudentProfile();
        profile.setUser(savedUser);
        profile.setStudentIdNumber(request.getStudentIdNumber().trim());
        profile.setUniversityName(request.getUniversityName().trim());
        profile.setCollegeName(request.getCollegeName().trim());
        profile.setCourseName(request.getCourseName().trim());
        profile.setDepartment(request.getDepartment().trim());
        profile.setAcademicYear(request.getAcademicYear().trim());
        profile.setSemester(request.getSemester() != null ? request.getSemester() : 1);
        profile.setState(request.getState() != null ? request.getState() : "Karnataka");
        profile.setCity(request.getCity() != null ? request.getCity() : "Bengaluru");
        profile.setMonthlyAllowance(request.getMonthlyAllowance() != null ? request.getMonthlyAllowance() : new BigDecimal("5000.00"));

        studentProfileRepository.save(profile);

        // 3. Create Student Digital Wallet Account
        Account account = new Account();
        account.setUser(savedUser);
        account.setAccountNumber("SB" + System.currentTimeMillis() % 10000000000L);
        account.setAccountType("STUDENT_WALLET");
        account.setBalance(new BigDecimal("3500.00")); // Starter student demo balance
        account.setCurrency("INR");

        String usernamePrefix = normalizedEmail.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        account.setUpiId(usernamePrefix + "@studentbank");
        account.setQrCodeToken(UUID.randomUUID().toString());
        account.setDailySpendLimit(new BigDecimal("5000.00"));
        account.setMonthlySpendLimit(new BigDecimal("30000.00"));
        account.setStatus("ACTIVE");

        Account savedAccount = accountRepository.save(account);

        // Seed initial rich data (transactions, budgets, goals, fees, rewards)
        seedNewStudentData(savedUser, savedAccount, profile);
        savedAccount = accountRepository.findById(savedAccount.getId()).orElse(savedAccount);

        // 4. Generate JWT Token
        String token = tokenProvider.generateTokenFromEmail(
                savedUser.getEmail(),
                savedUser.getPublicId(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );

        // 5. Log Security Event
        securityLogService.logEvent(savedUser.getId(), "USER_REGISTRATION", "SUCCESS", "Student registered successfully", httpRequest);

        return new AuthResponse(
                token,
                savedUser.getPublicId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name(),
                savedUser.getIsEmailVerified(),
                savedUser.getTwoFactorEnabled(),
                savedAccount.getAccountNumber(),
                savedAccount.getUpiId(),
                savedAccount.getBalance(),
                profile.getCollegeName()
        );
    }

    private void seedNewStudentData(User user, Account account, StudentProfile profile) {
        LocalDateTime now = LocalDateTime.now();
        ExpenseCategory foodCat = expenseCategoryRepository.findByCode("FOOD_CANTEEN").orElse(null);
        ExpenseCategory booksCat = expenseCategoryRepository.findByCode("BOOKS_STATIONARY").orElse(null);
        ExpenseCategory subsCat = expenseCategoryRepository.findByCode("SUBSCRIPTIONS").orElse(null);
        ExpenseCategory travelCat = expenseCategoryRepository.findByCode("TRAVEL_METRO").orElse(null);

        BigDecimal allowance = profile.getMonthlyAllowance() != null ? profile.getMonthlyAllowance() : new BigDecimal("6000.00");
        List<Transaction> txs = List.of(
                new Transaction(account, user, null, "INCOME", allowance, allowance, "UPI", "Monthly Allowance", "Parents / College Stipend Transfer", now.minusDays(5)),
                new Transaction(account, user, foodCat, "EXPENSE", new BigDecimal("350.00"), allowance.subtract(new BigDecimal("350.00")), "UPI", "Campus Canteen", "Lunch & Evening Refreshments", now.minusDays(3)),
                new Transaction(account, user, booksCat, "EXPENSE", new BigDecimal("550.00"), allowance.subtract(new BigDecimal("900.00")), "CARD", "College Bookstore", "Notebooks & Lab Study Material", now.minusDays(2)),
                new Transaction(account, user, subsCat, "EXPENSE", new BigDecimal("199.00"), allowance.subtract(new BigDecimal("1099.00")), "NET_BANKING", "Tech / Learning Platform", "Educational Cloud & Course Subscription", now.minusHours(4))
        );
        transactionRepository.saveAll(txs);
        account.setBalance(allowance.subtract(new BigDecimal("1099.00")));
        accountRepository.save(account);

        String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
        if (foodCat != null) budgetRepository.save(new MonthlyBudget(user, foodCat, currentMonth, new BigDecimal("2500.00"), new BigDecimal("350.00")));
        if (booksCat != null) budgetRepository.save(new MonthlyBudget(user, booksCat, currentMonth, new BigDecimal("1500.00"), new BigDecimal("550.00")));
        if (travelCat != null) budgetRepository.save(new MonthlyBudget(user, travelCat, currentMonth, new BigDecimal("1000.00"), BigDecimal.ZERO));
        if (subsCat != null) budgetRepository.save(new MonthlyBudget(user, subsCat, currentMonth, new BigDecimal("600.00"), new BigDecimal("199.00")));

        goalRepository.save(new SavingsGoal(user, "MacBook / Tech Upgrade Fund", "Fund for programming laptop", new BigDecimal("55000.00"), new BigDecimal("5500.00"), LocalDate.now().plusMonths(6), "TECH", new BigDecimal("5000.00")));
        goalRepository.save(new SavingsGoal(user, "Emergency Buffer & Exam Contingency", "Safety fund for unexpected expenses", new BigDecimal("10000.00"), new BigDecimal("2000.00"), LocalDate.now().plusMonths(3), "EMERGENCY", new BigDecimal("1000.00")));

        feeRepository.save(new FeeReminder(user, "TUITION", "Semester " + (profile.getSemester() != null ? profile.getSemester() : 1) + " College Tuition Fee", new BigDecimal("35000.00"), BigDecimal.ZERO, LocalDate.now().plusDays(25), "Current Academic Year", "PENDING"));
        feeRepository.save(new FeeReminder(user, "HOSTEL", "Hostel & Campus Mess Advance", new BigDecimal("15000.00"), new BigDecimal("15000.00"), LocalDate.now().minusDays(10), "Current Academic Year", "PAID"));

        rewardRepository.save(new StudentReward(user, "Welcome to StudentBank", "ONBOARDING", 100, "Completed student registration & smart digital wallet setup", "Award"));
        rewardRepository.save(new StudentReward(user, "First Vault Milestone", "SAVER", 50, "Allocated initial seed funds towards your tech upgrade goal", "Zap"));
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);
        Account account = accountRepository.findByUserId(user.getId()).orElse(null);

        String token = tokenProvider.generateToken(authentication);

        securityLogService.logEvent(user.getId(), "LOGIN_SUCCESS", "SUCCESS", "Student logged in successfully", httpRequest);

        return new AuthResponse(
                token,
                user.getPublicId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getIsEmailVerified(),
                user.getTwoFactorEnabled(),
                account != null ? account.getAccountNumber() : "N/A",
                account != null ? account.getUpiId() : "N/A",
                account != null ? account.getBalance() : BigDecimal.ZERO,
                profile != null ? profile.getCollegeName() : "University"
        );
    }

    @Transactional
    public boolean verifyOtp(VerifyOtpRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new BadRequestException("OTP cannot be empty.");
        }

        // Accept user's generated OTP or global fallback "123456" for demo
        boolean isValid = "123456".equals(request.getOtp().trim()) ||
                (request.getOtp().trim().equals(user.getOtpCode()) &&
                        user.getOtpExpiryTime() != null &&
                        user.getOtpExpiryTime().isAfter(LocalDateTime.now()));

        if (!isValid) {
            throw new BadRequestException("Invalid or expired OTP code.");
        }

        user.setIsEmailVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return true;
    }

    @Transactional
    public String resendOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        String newOtp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(newOtp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        return newOtp;
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + normalizedEmail));

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        return "Password reset OTP has been generated. Use code: " + otp;
    }

    @Transactional
    public boolean resetPassword(ResetPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        boolean isValid = "123456".equals(request.getOtp().trim()) ||
                (request.getOtp().trim().equals(user.getOtpCode()) &&
                        user.getOtpExpiryTime() != null &&
                        user.getOtpExpiryTime().isAfter(LocalDateTime.now()));

        if (!isValid) {
            throw new BadRequestException("Invalid or expired OTP code.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setOtpCode(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return true;
    }
}
