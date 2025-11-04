package com.nayeon.diet.backend.controller;

import com.nayeon.diet.backend.entity.UserLocation;
import com.nayeon.diet.backend.repository.UserLocationRepository;
import com.nayeon.diet.backend.entity.Location;
import com.nayeon.diet.backend.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
@CrossOrigin(origins = "http://localhost:5173") // ✅ 프론트 허용
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserLocationRepository userLocationRepository;

    // 🔹 1️⃣ 모든 장소 조회
    @GetMapping
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    // 🔹 2️⃣ 장소 등록
    @PostMapping
    public Location createLocation(@RequestBody Location location) {
        return locationRepository.save(location);
    }

    // 🔹 3️⃣ 특정 장소 조회
    @GetMapping("/{id}")
    public Location getLocationById(@PathVariable Long id) {
        return locationRepository.findById(id).orElse(null);
    }

    // 🔹 4️⃣ 장소 수정
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody Location updated) {
        Location loc = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 장소가 존재하지 않습니다."));
        loc.setName(updated.getName());
        loc.setDescription(updated.getDescription());
        return ResponseEntity.ok(locationRepository.save(loc));
    }

    // 🔹 5️⃣ 장소 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        if (!locationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        locationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 6️⃣ 사용자 장소 선택 (선택된 장소만 유지)
    @PostMapping("/select")
    public ResponseEntity<UserLocation> selectLocation(
            @RequestParam String nickname,
            @RequestParam Long locationId
    ) {
        Location loc = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("해당 장소가 없습니다."));

        // ✅ 기존 선택된 장소가 있다면 삭제 후 새로 추가
        userLocationRepository.deleteByNickname(nickname);
        UserLocation userLoc = new UserLocation(nickname, loc);
        return ResponseEntity.ok(userLocationRepository.save(userLoc));
    }

    // 🔹 7️⃣ 특정 사용자 최신 선택 장소 조회
    @GetMapping("/latest/{nickname}")
    public ResponseEntity<UserLocation> getLatestLocation(@PathVariable String nickname) {
        UserLocation latest = userLocationRepository.findTopByNicknameOrderByIdDesc(nickname);
        return (latest != null) ? ResponseEntity.ok(latest) : ResponseEntity.notFound().build();
    }
}
