package hu.fitness.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/images/**") // Engedélyezzük a képek elérését
                .allowedOrigins("http://localhost:3000") // Frontend URL
                .allowedMethods("GET")
                .allowCredentials(true); // Engedélyezzük a cookie-kat és hitelesítést

    }
}