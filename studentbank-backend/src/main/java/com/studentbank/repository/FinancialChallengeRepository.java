package com.studentbank.repository;

import com.studentbank.entity.FinancialChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialChallengeRepository extends JpaRepository<FinancialChallenge, Long> {

    List<FinancialChallenge> findByIsActiveTrue();
}
