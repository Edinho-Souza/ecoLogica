package br.com.ecologica.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoUsuario {
    cidadao,
    recicladora,
    apoiadora,
    admin;

    @JsonCreator
    public static TipoUsuario fromJson(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toLowerCase();
        if ("comum".equals(normalized) || "usuario".equals(normalized)) {
            return cidadao;
        }

        for (TipoUsuario tipo : values()) {
            if (tipo.name().equals(normalized)) {
                return tipo;
            }
        }

        throw new IllegalArgumentException("Tipo de usuario invalido: " + value);
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
