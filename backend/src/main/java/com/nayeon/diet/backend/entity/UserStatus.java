package com.nayeon.diet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_status")
public class UserStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 회원의 상태인지 (User와 연결)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate startDate;   // 운동 시작 날짜
    private LocalDate endDate;     // 운동 종료 날짜

    private Boolean isAnemic;      // 빈혈 여부

    @Column(length = 20)
    private String activityLevel;  // 운동 강도 (none, light, moderate, hard 등)

    public UserStatus() {}

    public UserStatus(User user, LocalDate startDate, LocalDate endDate, Boolean isAnemic, String activityLevel) {
        this.user = user;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isAnemic = isAnemic;
        this.activityLevel = activityLevel;
    }

    // ✅ Getter / Setter
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Boolean getIsAnemic() { return isAnemic; }
    public void setIsAnemic(Boolean isAnemic) { this.isAnemic = isAnemic; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
}
