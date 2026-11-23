package com.studentbank.controller;

import com.studentbank.dto.ApiResponse;
import com.studentbank.dto.StudentProfileResponse;
import com.studentbank.dto.UpdateProfileRequest;
import com.studentbank.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getCurrentStudentProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        StudentProfileResponse profile = studentProfileService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Student profile fetched successfully", profile));
    }

    @GetMapping("/profile/{publicId}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfileById(@PathVariable String publicId) {
        StudentProfileResponse profile = studentProfileService.getProfileByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.success("Student profile fetched", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        StudentProfileResponse updated = studentProfileService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated successfully", updated));
    }
}
