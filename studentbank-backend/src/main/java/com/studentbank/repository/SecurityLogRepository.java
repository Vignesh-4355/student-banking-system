package com.studentbank.repository;

import com.studentbank.entity.SecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {

    List<SecurityLog> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);

    List<SecurityLog> findTop50ByOrderByCreatedAtDesc();
}
