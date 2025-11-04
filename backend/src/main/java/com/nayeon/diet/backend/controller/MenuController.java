package com.nayeon.diet.backend.controller;

import com.nayeon.diet.backend.entity.Menu;
import com.nayeon.diet.backend.repository.MenuRepository;
import com.nayeon.diet.backend.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.nayeon.diet.backend.dto.MenuRequest;

import java.util.List;

@RestController
@RequestMapping("/menus")
@CrossOrigin(origins = "http://localhost:5173") // 프론트엔드와 연동 시 필요
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    @PostMapping
    public Menu createMenu(@RequestBody MenuRequest menuRequest) {
        // Location 객체 찾아오기
        var location = locationRepository.findById(menuRequest.getLocationId())
                .orElseThrow(() -> new RuntimeException("해당 Location이 존재하지 않습니다."));

        // 새 Menu 생성
        Menu menu = new Menu();
        menu.setName(menuRequest.getName());
        menu.setCategory(menuRequest.getCategory());
        menu.setLocation(location); // ✅ location 연결

        return menuRepository.save(menu);
    }
}