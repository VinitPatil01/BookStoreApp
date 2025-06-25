package com.cdac.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Make sure this doesn't conflict with /api/** paths
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}