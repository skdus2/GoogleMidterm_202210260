package com.nayeon.diet.backend.repository;

import com.nayeon.diet.backend.entity.MealRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface MealRecordRepository extends JpaRepository<MealRecord, Long> {

    // 최근 한 달간 기록 조회 (AI용)
    @Query("""
        SELECT r
        FROM MealRecord r
        WHERE r.date BETWEEN :startDate AND :endDate
        ORDER BY r.date ASC
    """)
    List<MealRecord> findRecentMeals(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    // ✅ 오래된 기록 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM MealRecord r WHERE r.date < :cutoff")
    int deleteOldRecords(@Param("cutoff") LocalDateTime cutoff);
}