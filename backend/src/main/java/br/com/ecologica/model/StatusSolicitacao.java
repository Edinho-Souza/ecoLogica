package br.com.ecologica.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusSolicitacao {
    pendente,
    andamento,
    concluida;

    @JsonCreator
    public static StatusSolicitacao fromJson(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toLowerCase();
        for (StatusSolicitacao status : values()) {
            if (status.name().equals(normalized)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Status de solicitacao invalido: " + value);
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
