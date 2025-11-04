package com.nayeon.diet.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "meal_records")
public class MealRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date; // 식사 날짜 및 시간

    private String mealTime; // 아침 / 점심 / 저녁

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;
}