package br.com.ecologica.cadastro.usuarios.dto;

import br.com.ecologica.cadastro.usuarios.model.StatusUsuario;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "O novo status é obrigatório.")
    private StatusUsuario status;
}