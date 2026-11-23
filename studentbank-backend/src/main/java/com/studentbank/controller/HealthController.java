package com.studentbank.controller;

import com.studentbank.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "StudentBank API");
        status.put("status", "UP");
        status.put("version", "1.0.0");
        status.put("currency", "INR (₹)");
        status.put("serverTime", LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.success("StudentBank Service is operational", status));
    }
}
