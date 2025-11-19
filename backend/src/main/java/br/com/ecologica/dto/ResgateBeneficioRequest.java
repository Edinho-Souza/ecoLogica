package br.com.ecologica.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResgateBeneficioRequest {

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long idUsuario;

    @NotNull(message = "O ID do benefício é obrigatório")
    private Long idBeneficio;
}