package com.nayeon.diet.backend.service;

import com.nayeon.diet.backend.repository.MealRecordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

@Service
public class MealCleanupService {

    @Autowired
    private MealRecordRepository mealRecordRepository;

    /**
     * 매일 새벽 3시에 한 달 이상 지난 식사 기록 자동 삭제
     * (cron 표현식: 초 분 시 일 월 요일)
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void cleanupOldMealRecords() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        int deleted = mealRecordRepository.deleteOldRecords(cutoffDate);
        System.out.println("[MealCleanupService] " + deleted + "개의 오래된 식사 기록 삭제 완료 (" + cutoffDate + " 이전)");
    }
}