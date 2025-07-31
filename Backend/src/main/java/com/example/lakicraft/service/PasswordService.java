package com.example.lakicraft.service;

import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class PasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean checkPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public String getUserPassword(Long userId) {
        return userRepository.findById(userId)
                .map(User::getPassword)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void saveUserPassword(Long userId, String rawPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);
    }

    public void updateUserPassword(Long userId, String rawPassword) {
        saveUserPassword(userId, rawPassword);
    }
}
