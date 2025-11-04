package com.nayeon.diet.backend.controller;

import com.nayeon.diet.backend.entity.MealRecord;
import com.nayeon.diet.backend.entity.Menu;
import com.nayeon.diet.backend.repository.MealRecordRepository;
import com.nayeon.diet.backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meal-records")
@CrossOrigin(origins = "http://localhost:5173")
public class MealRecordController {

    @Autowired
    private MealRecordRepository mealRecordRepository;

    @Autowired
    private MenuRepository menuRepository;

    // ✅ 모든 기록 조회
    @GetMapping
    public List<MealRecord> getAllRecords() {
        return mealRecordRepository.findAll();
    }

    // ✅ 식사 기록 추가
    @PostMapping
    public MealRecord createMealRecord(@RequestBody MealRecord record) {
        if (record.getMenu() != null && record.getMenu().getName() != null) {
            String name = record.getMenu().getName();
            Menu menu = menuRepository.findByName(name)
                    .orElseGet(() -> {
                        Menu newMenu = new Menu();
                        newMenu.setName(name);
                        newMenu.setCategory("기타");
                        return menuRepository.save(newMenu);
                    });
            record.setMenu(menu);
        } else {
            throw new RuntimeException("Menu name is required");
        }

        return mealRecordRepository.save(record);
    }

    // ✅ 기록 수정 (날짜 + 식사시간 + 메뉴 모두 가능)
    @PutMapping("/{id}")
    public ResponseEntity<MealRecord> updateRecord(@PathVariable Long id, @RequestBody MealRecord newData) {
        MealRecord record = mealRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 기록이 없습니다."));

        // 날짜 수정
        if (newData.getDate() != null) record.setDate(newData.getDate());

        // 식사 시간 수정
        if (newData.getMealTime() != null) record.setMealTime(newData.getMealTime());

        // 메뉴 수정
        if (newData.getMenu() != null && newData.getMenu().getName() != null) {
            String name = newData.getMenu().getName();
            Menu menu = menuRepository.findByName(name)
                    .orElseGet(() -> {
                        Menu newMenu = new Menu();
                        newMenu.setName(name);
                        newMenu.setCategory("기타");
                        return menuRepository.save(newMenu);
                    });
            record.setMenu(menu);
        }

        return ResponseEntity.ok(mealRecordRepository.save(record));
    }

    // ✅ 기록 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        if (!mealRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mealRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}