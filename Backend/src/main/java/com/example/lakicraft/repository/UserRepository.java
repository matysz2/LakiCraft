package com.example.lakicraft.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lakicraft.model.User;


   
    public interface UserRepository extends JpaRepository<User, Integer> {
        Optional<User> findByEmail(String email); 

        Optional<User> findById(Long id);
}

