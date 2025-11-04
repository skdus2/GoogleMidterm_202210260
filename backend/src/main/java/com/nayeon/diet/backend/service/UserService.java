package com.nayeon.diet.backend.service;

import com.nayeon.diet.backend.entity.User;
import com.nayeon.diet.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 회원가입
    public User register(User user) {
        // 중복 이메일 방지
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        return userRepository.save(user);
    }

    // 로그인
    public User login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty() || !user.get().getPassword().equals(password)) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 잘못되었습니다.");
        }
        return user.get();
    }

    // 사용자 조회
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}