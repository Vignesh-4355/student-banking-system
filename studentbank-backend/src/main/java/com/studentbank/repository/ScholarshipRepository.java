package com.studentbank.repository;

import com.studentbank.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {

    List<Scholarship> findByIsActiveTrueOrderByApplicationDeadlineAsc();
}
