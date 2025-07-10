package com.example.cc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class JpaPerformanceConfig {

    /**
     * Configuración adicional para mejorar el rendimiento de batch operations
     * Solo propiedades JPA sin conflictos de beans
     */
    @Bean("additionalJpaProperties")
    public Properties additionalJpaProperties() {
        Properties properties = new Properties();
        
        // Configuraciones de batch processing optimizadas
        properties.setProperty("hibernate.jdbc.batch_size", "25");
        properties.setProperty("hibernate.order_inserts", "true");
        properties.setProperty("hibernate.order_updates", "true");
        properties.setProperty("hibernate.jdbc.batch_versioned_data", "true");
        properties.setProperty("hibernate.jdbc.use_batch_prepared_statement", "true");
        
        // Configuraciones de cache de segundo nivel
        properties.setProperty("hibernate.cache.use_second_level_cache", "true");
        properties.setProperty("hibernate.cache.use_query_cache", "true");
        
        // Configuraciones para manejar grandes colecciones
        properties.setProperty("hibernate.jdbc.fetch_size", "50");
        properties.setProperty("hibernate.default_batch_fetch_size", "25");
        
        // Configuraciones para mejorar conexiones
        properties.setProperty("hibernate.connection.provider_disables_autocommit", "true");
        properties.setProperty("hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS", "1000");
        
        // Configuraciones adicionales para PostgreSQL
        properties.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        properties.setProperty("hibernate.temp.use_jdbc_metadata_defaults", "false");
        
        return properties;
    }
}
