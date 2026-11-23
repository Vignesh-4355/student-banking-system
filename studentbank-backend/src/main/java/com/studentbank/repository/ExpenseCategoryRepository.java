package com.studentbank.repository;

import com.studentbank.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {

    List<ExpenseCategory> findByUserIdOrIsCustomFalse(Long userId);

    Optional<ExpenseCategory> findByCode(String code);

    Boolean existsByCode(String code);
}
