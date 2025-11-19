package br.com.ecologica.dto;

import br.com.ecologica.model.StatusUsuario;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "O novo status é obrigatório.")
    private StatusUsuario status;
}