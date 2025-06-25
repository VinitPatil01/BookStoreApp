package com.cdac.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.AllArgsConstructor;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@AllArgsConstructor
public class SecurityConfiguration {
    
    private final PasswordEncoder encoder;
    private final JWTCustomFilter jwtCustomFilter;
    
    @Bean
    SecurityFilterChain configureSecFilterChain(HttpSecurity http) throws Exception {
        // Disable CSRF protection for stateless REST APIs
        http.csrf(csrf -> csrf.disable());
        
        // Enable CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        // Disable form login since we're using JWT
        http.formLogin(form -> form.disable());
        
        // Configure authorization rules based on actual controller mappings
        http.authorizeHttpRequests(request -> request
                // Public endpoints - no authentication required
                .requestMatchers(
                    "/v*/api-docs/**", 
                    "/swagger-ui/**", 
                    "/swagger-ui.html",
                    "/users/signup", 
                    "/users/signin",
                    "/api/users/signup",
                    "/api/users/signin",
                    "/health"
                ).permitAll()
                
                // Book public endpoints - based on your BookController
                .requestMatchers(
                    "/api/books/public",
                    "/api/books/public/**"
                ).permitAll()
                
                // Category endpoints - all public based on your CategoryController
                .requestMatchers(
                    "/api/categories",
                    "/api/categories/**"
                ).permitAll()
                
                // ADMIN only endpoints
                .requestMatchers(
                    "/api/books/admin/**",
                    "/api/cart/admin/**",
                    "/api/users/admin/**"
                ).hasRole("ADMIN")
                
                // SELLER specific endpoints
                .requestMatchers(
                    "/api/books/seller",
                    "/api/books/seller/**"
                ).hasRole("SELLER")
                
                // BUYER specific endpoints (Cart operations)
                .requestMatchers(
                    "/api/cart",
                    "/api/cart/**"
                ).hasRole("BUYER")
                
                // Endpoints accessible by both BUYER and SELLER (with @PreAuthorize)
                .requestMatchers(
                    "/api/books",
                    "/api/books/*/availability"
                ).hasAnyRole("BUYER", "SELLER")
                
                // Any other request requires authentication
                .anyRequest().authenticated()
        )
        
        // Configure stateless session management
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        
        // Add JWT filter before authentication filter
        http.addFilterBefore(jwtCustomFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Be more specific in production
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}