package com.nayeon.diet.backend.controller;

import com.nayeon.diet.backend.entity.User;
import com.nayeon.diet.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ 회원가입
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "이미 존재하는 이메일입니다.";
        }
        userRepository.save(user);
        return "회원가입 성공";
    }

    // ✅ 로그인 (임시, JWT 없이)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isEmpty()) {
            response.put("message", "존재하지 않는 이메일입니다.");
            return response;
        }

        if (!existingUser.get().getPassword().equals(user.getPassword())) {
            response.put("message", "비밀번호가 올바르지 않습니다.");
            return response;
        }

        response.put("message", "로그인 성공");
        response.put("nickname", existingUser.get().getNickname()); // ✅ 닉네임 포함
        return response;
    }
}