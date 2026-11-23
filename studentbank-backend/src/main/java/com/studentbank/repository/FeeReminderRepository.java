package com.studentbank.repository;

import com.studentbank.entity.FeeReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeReminderRepository extends JpaRepository<FeeReminder, Long> {

    List<FeeReminder> findByUserIdOrderByDueDateAsc(Long userId);
}
