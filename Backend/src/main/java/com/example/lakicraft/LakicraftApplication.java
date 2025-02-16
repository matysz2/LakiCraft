package com.example.lakicraft;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.lakicraft.repository") // Upewnij się, że to jest odpowiedni pakiet
@EntityScan(basePackages = "com.example.lakicraft.model")  // Upewnij się, że dodasz odpowiedni pakiet
public class LakicraftApplication {

    public static void main(String[] args) {
        SpringApplication.run(LakicraftApplication.class, args);
        
        
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
                // Ustawienie pozwolenia na dostęp do API z front-endu na porcie 3000
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000") // Port front-endu React
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Dozwolone metody HTTP
                        .allowedHeaders("*") // Dozwolone nagłówki
                        .allowCredentials(true); // Jeśli potrzebujesz uwierzytelniania, ciasteczek
            }
        };
    }
}
