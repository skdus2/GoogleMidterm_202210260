package com.nayeon.diet.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // ✅ 추가

@SpringBootApplication
@EnableScheduling // ✅ 스케줄러 기능 활성화
public class DietAiBackendApplication {

	public static void main(String[] args) {
        SpringApplication.run(DietAiBackendApplication.class, args);
    }
}
