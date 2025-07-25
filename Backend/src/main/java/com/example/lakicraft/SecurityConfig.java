package com.example.lakicraft;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                // Wyłącz CSRF, jeśli masz REST API
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()                  // Wszystkie żądania dostępne publicznie, bez auth
            );
            // Nie dodajemy .httpBasic(), bo nie chcemy wymuszać uwierzytelniania

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();             // Haszowanie haseł
    }
}
