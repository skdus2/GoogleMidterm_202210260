package com.nayeon.diet.backend.repository;

import com.nayeon.diet.backend.entity.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {
    UserLocation findTopByNicknameOrderByIdDesc(String nickname);
    void deleteByNickname(String nickname); // ✅ 닉네임 중복 선택 방지용
}
