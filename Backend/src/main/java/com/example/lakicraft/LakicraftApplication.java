package com.example.lakicraft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.lakicraft.repository")
@EntityScan(basePackages = "com.example.lakicraft.model")
public class LakicraftApplication {

    public static void main(String[] args) {
        SpringApplication.run(LakicraftApplication.class, args);
    }
    
    // Konfiguracja CORS została całkowicie stąd usunięta, 
    // ponieważ jej bezpieczna wersja znajduje się teraz w WebConfig.java
}