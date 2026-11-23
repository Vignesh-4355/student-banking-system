package com.studentbank.service;

import com.studentbank.entity.SecurityLog;
import com.studentbank.repository.SecurityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class SecurityLogService {

    private final SecurityLogRepository securityLogRepository;

    public SecurityLogService(SecurityLogRepository securityLogRepository) {
        this.securityLogRepository = securityLogRepository;
    }

    public void logEvent(Long userId, String eventType, String status, String details, HttpServletRequest request) {
        String ipAddress = "127.0.0.1";
        String userAgent = "Unknown";

        if (request != null) {
            String clientIp = request.getHeader("X-Forwarded-For");
            if (clientIp == null || clientIp.isEmpty()) {
                clientIp = request.getRemoteAddr();
            }
            ipAddress = clientIp != null ? clientIp : "127.0.0.1";
            userAgent = request.getHeader("User-Agent");
            if (userAgent != null && userAgent.length() > 250) {
                userAgent = userAgent.substring(0, 250);
            }
        }

        SecurityLog log = new SecurityLog(
                userId,
                eventType,
                ipAddress,
                userAgent,
                "Web Browser",
                status,
                details
        );
        securityLogRepository.save(log);
    }
}
