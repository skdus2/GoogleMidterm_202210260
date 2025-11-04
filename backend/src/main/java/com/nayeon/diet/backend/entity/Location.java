package com.nayeon.diet.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;  // 장소 이름 (예: 학식, 구내식당 등)

    @Column(columnDefinition = "TEXT")
    private String description; // 메뉴 목록: "닭갈비덮밥, 야채비빔밥, 연어샐러드"

    public Location() {}
    public Location(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}