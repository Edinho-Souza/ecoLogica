package br.com.ecologica.cadastro.beneficios.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BeneficioRequest {

    @NotBlank(message = "O título do benefício é obrigatório")
    private String titulo; 

    private String descricao;

    @NotNull(message = "Os pontos necessários são obrigatórios")
    @Min(value = 1, message = "Deve exigir ao menos 1 ponto")
    private Integer pontosNecessarios;
}