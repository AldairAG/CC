package com.example.cc.dto.response;

import com.example.cc.entities.Usuario;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class  LoginResponse {
    private String token;
    private Usuario usuario;
    private String error;
}
