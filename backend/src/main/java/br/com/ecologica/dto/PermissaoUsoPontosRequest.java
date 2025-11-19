package br.com.ecologica.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PermissaoUsoPontosRequest {
    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;

    private boolean permitido;
    private String motivo;
}