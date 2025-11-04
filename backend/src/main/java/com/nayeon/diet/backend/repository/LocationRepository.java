package com.nayeon.diet.backend.repository;

import com.nayeon.diet.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    // ✅ 추가 (장소 이름으로 조회)
    Optional<Location> findByName(String name);
}