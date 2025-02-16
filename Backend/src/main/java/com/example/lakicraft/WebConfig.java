package com.example.lakicraft;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
        registry.addMapping("/**")  // Zezwolenie na dostęp do wszystkich endpointów
                .allowedOrigins("http://localhost:3000")  // Zezwolenie tylko dla domeny frontendowej
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Dozwolone metody
                .allowedHeaders("*")
                .allowCredentials(true);  // Zezwolenie na poświadczenia
    }
}
