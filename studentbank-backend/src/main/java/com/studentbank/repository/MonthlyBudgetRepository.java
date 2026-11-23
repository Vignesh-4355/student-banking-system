package com.studentbank.repository;

import com.studentbank.entity.MonthlyBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, Long> {

    List<MonthlyBudget> findByUserIdAndMonthYear(Long userId, String monthYear);

    List<MonthlyBudget> findByUserId(Long userId);
}
