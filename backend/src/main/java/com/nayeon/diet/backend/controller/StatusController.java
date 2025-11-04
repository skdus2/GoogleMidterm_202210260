package com.nayeon.diet.backend.controller;

import com.nayeon.diet.backend.entity.Status;
import com.nayeon.diet.backend.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/status")
@CrossOrigin(origins = "http://localhost:5173")
public class StatusController {

    @Autowired
    private StatusRepository statusRepository;

    // ✅ 상태 등록 또는 수정
    @PostMapping
    public Status saveStatus(@RequestBody Status status) {
        Optional<Status> existing = statusRepository.findByNickname(status.getNickname());
        if (existing.isPresent()) {
            Status s = existing.get();
            s.setCondition(status.getCondition());
            s.setGoal(status.getGoal());
            s.setAllergy(status.getAllergy());
            s.setNotes(status.getNotes());
            return statusRepository.save(s);
        }
        return statusRepository.save(status);
    }

    // ✅ 상태 조회
    @GetMapping("/{nickname}")
    public Optional<Status> getStatus(@PathVariable String nickname) {
        return statusRepository.findByNickname(nickname);
    }
}