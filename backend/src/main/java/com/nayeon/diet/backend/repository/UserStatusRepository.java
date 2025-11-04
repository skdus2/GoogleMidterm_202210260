package com.nayeon.diet.backend.repository;

import com.nayeon.diet.backend.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStatusRepository extends JpaRepository<UserStatus, Long> { }