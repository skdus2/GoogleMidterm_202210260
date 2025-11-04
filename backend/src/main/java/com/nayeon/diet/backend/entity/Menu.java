package com.nayeon.diet.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "menus")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 메뉴 이름

    @Column(nullable = false)
    private String category; // 메뉴 분류 (ex: 한식, 양식, 디저트)

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location; // 학식, 카페 등 장소 참조
}