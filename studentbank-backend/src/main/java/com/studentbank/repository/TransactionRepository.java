package com.studentbank.repository;

import com.studentbank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    List<Transaction> findTop10ByUserIdOrderByTransactionDateDesc(Long userId);

    long countByUserId(Long userId);
}
