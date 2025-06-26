package com.example.cc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cc/health")
@CrossOrigin(origins = "http://localhost:5173")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            health.put("status", "UP");
            health.put("timestamp", LocalDateTime.now());
            health.put("application", "24bet Casino & Sports");
            health.put("version", "1.0.0");
            
            // Verificar conexión a la base de datos
            try (Connection connection = dataSource.getConnection()) {
                health.put("database", "UP");
                health.put("db_url", connection.getMetaData().getURL());
            } catch (SQLException e) {
                health.put("database", "DOWN");
                health.put("db_error", e.getMessage());
            }
            
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(500).body(health);
        }
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("app_name", "24bet");
        info.put("description", "Plataforma de Casino y Apuestas Deportivas");
        info.put("version", "1.0.0");
        info.put("java_version", System.getProperty("java.version"));
        info.put("spring_profiles", System.getProperty("spring.profiles.active", "default"));
        info.put("uptime", System.currentTimeMillis());
        
        return ResponseEntity.ok(info);
    }
}
