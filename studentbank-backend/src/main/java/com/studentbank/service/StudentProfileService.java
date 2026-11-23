package com.studentbank.service;

import com.studentbank.dto.StudentProfileResponse;
import com.studentbank.dto.UpdateProfileRequest;
import com.studentbank.entity.Account;
import com.studentbank.entity.StudentProfile;
import com.studentbank.entity.User;
import com.studentbank.exception.ResourceNotFoundException;
import com.studentbank.repository.AccountRepository;
import com.studentbank.repository.StudentProfileRepository;
import com.studentbank.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AccountRepository accountRepository;

    public StudentProfileService(UserRepository userRepository,
                                 StudentProfileRepository studentProfileRepository,
                                 AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        Account account = accountRepository.findByUserId(user.getId()).orElse(null);

        return mapToResponse(user, profile, account);
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfileByPublicId(String publicId) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + publicId));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + publicId));

        Account account = accountRepository.findByUserId(user.getId()).orElse(null);

        return mapToResponse(user, profile, account);
    }

    @Transactional
    public StudentProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }
        userRepository.save(user);

        if (request.getCollegeName() != null) profile.setCollegeName(request.getCollegeName().trim());
        if (request.getUniversityName() != null) profile.setUniversityName(request.getUniversityName().trim());
        if (request.getCourseName() != null) profile.setCourseName(request.getCourseName().trim());
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment().trim());
        if (request.getAcademicYear() != null) profile.setAcademicYear(request.getAcademicYear().trim());
        if (request.getSemester() != null) profile.setSemester(request.getSemester());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getEmergencyContact() != null) profile.setEmergencyContact(request.getEmergencyContact());
        if (request.getState() != null) profile.setState(request.getState());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getMonthlyAllowance() != null) profile.setMonthlyAllowance(request.getMonthlyAllowance());

        StudentProfile updatedProfile = studentProfileRepository.save(profile);
        Account account = accountRepository.findByUserId(user.getId()).orElse(null);

        return mapToResponse(user, updatedProfile, account);
    }

    private StudentProfileResponse mapToResponse(User user, StudentProfile profile, Account account) {
        StudentProfileResponse resp = new StudentProfileResponse();
        resp.setPublicId(user.getPublicId());
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setPhoneNumber(user.getPhoneNumber());
        resp.setRole(user.getRole().name());
        resp.setIsEmailVerified(user.getIsEmailVerified());
        resp.setTwoFactorEnabled(user.getTwoFactorEnabled());
        resp.setProfileImageUrl(user.getProfileImageUrl());

        resp.setStudentIdNumber(profile.getStudentIdNumber());
        resp.setUniversityName(profile.getUniversityName());
        resp.setCollegeName(profile.getCollegeName());
        resp.setCourseName(profile.getCourseName());
        resp.setDepartment(profile.getDepartment());
        resp.setAcademicYear(profile.getAcademicYear());
        resp.setSemester(profile.getSemester());
        resp.setDateOfBirth(profile.getDateOfBirth());
        resp.setEmergencyContact(profile.getEmergencyContact());
        resp.setState(profile.getState());
        resp.setCity(profile.getCity());
        resp.setMonthlyAllowance(profile.getMonthlyAllowance());

        if (account != null) {
            resp.setAccountNumber(account.getAccountNumber());
            resp.setUpiId(account.getUpiId());
            resp.setWalletBalance(account.getBalance());
            resp.setDailySpendLimit(account.getDailySpendLimit());
            resp.setMonthlySpendLimit(account.getMonthlySpendLimit());
            resp.setAccountStatus(account.getStatus());
        }

        return resp;
    }
}
