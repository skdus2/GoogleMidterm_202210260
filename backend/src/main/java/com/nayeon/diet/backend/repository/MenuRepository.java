package com.nayeon.diet.backend.repository;

import com.nayeon.diet.backend.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByName(String name);
}
