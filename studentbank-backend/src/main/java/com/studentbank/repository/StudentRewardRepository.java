package com.studentbank.repository;

import com.studentbank.entity.StudentReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRewardRepository extends JpaRepository<StudentReward, Long> {

    List<StudentReward> findByUserIdOrderByUnlockedAtDesc(Long userId);
}
