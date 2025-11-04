package com.nayeon.diet.backend.repository;

import com.nayeon.diet.backend.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findByNickname(String nickname);
}