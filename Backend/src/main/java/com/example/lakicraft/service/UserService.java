package com.example.lakicraft.service;

import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    
    public UserService(UserRepository userRepository, PasswordService passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    // Autentykacja użytkownika


    // Pobieranie użytkownika bez hasła
    public User getUserWithoutPassword(int id) {
        return userRepository.findById(id).map(user -> {
            user.setPassword(null); // Usuwamy hasło przed zwróceniem
            return user;
        }).orElse(null);
    }

    // Aktualizacja użytkownika
    public User updateUser(int id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            if (updatedUser.getPassword() != null) {
                user.setPassword(passwordService.hashPassword(updatedUser.getPassword())); // Haszowanie nowego hasła
            }
            if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
            userRepository.save(user);
            return user;
        }).orElse(null);
    }

    // Usuwanie użytkownika
    public boolean deleteUser(int id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }
}
