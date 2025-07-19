package com.example.cc.entities.enums;

public enum GameType {
    APUESTA("Participacion en apuesta"),
    CASINO("Juego de casino"),
    QUINIELA("Participacion en quiniela");

    private final String description;

        GameType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
