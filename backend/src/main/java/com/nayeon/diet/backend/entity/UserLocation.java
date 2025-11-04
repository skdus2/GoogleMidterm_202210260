package com.nayeon.diet.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_locations")
public class UserLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;  // ✅ 사용자 식별용

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;  // ✅ 어떤 장소인지

    public UserLocation() {}
    public UserLocation(String nickname, Location location) {
        this.nickname = nickname;
        this.location = location;
    }

    public Long getId() { return id; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
}