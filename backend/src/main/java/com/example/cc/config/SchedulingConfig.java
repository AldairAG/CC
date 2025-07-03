package com.example.cc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    // Configuración para habilitar scheduled tasks
    // Los métodos anotados con @Scheduled se ejecutarán automáticamente
}
