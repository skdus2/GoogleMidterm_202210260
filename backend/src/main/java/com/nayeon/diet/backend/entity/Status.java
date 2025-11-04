package com.nayeon.diet.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "status")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname; // 사용자 닉네임

    @Column(name = "user_condition")
    private String condition; // 현재 상태 (ex: 피곤함, 운동 중 등)
    private String goal; // 식단 목표 (ex: 다이어트, 근육 증가)
    private String allergy; // 알러지 정보
    private String notes; // 기타 메모
}