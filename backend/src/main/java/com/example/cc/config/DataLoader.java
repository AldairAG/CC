package com.example.cc.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.cc.constants.ROLES;
import com.example.cc.entities.Rol;
import com.example.cc.repository.RolRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Override
    public void run(String... args) throws Exception {

        // Crear roles si no existen
        if (rolRepository.findByNombreRol(ROLES.ADMIN_STRING).isEmpty()) {
            rolRepository.save(Rol.builder().nombreRol(ROLES.ADMIN_STRING).build());
        }
        if (rolRepository.findByNombreRol(ROLES.CLIENTE_STRING).isEmpty()) {
            rolRepository.save(Rol.builder().nombreRol(ROLES.CLIENTE_STRING).build());
        }
        if (rolRepository.findByNombreRol(ROLES.PROPIETARIO_STRING).isEmpty()) {
            rolRepository.save(Rol.builder().nombreRol(ROLES.PROPIETARIO_STRING).build());
        }
    }
}