package br.com.ecologica.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BeneficioRequest {

    @NotBlank(message = "O titulo do beneficio e obrigatorio")
    private String titulo;

    private String descricao;

    @NotNull(message = "Os pontos necessarios sao obrigatorios")
    @Min(value = 1, message = "Deve exigir ao menos 1 ponto")
    private Integer pontosNecessarios;

    private String imagemUrl;

    @Min(value = 0, message = "O estoque nao pode ser negativo")
    private Integer estoque;
}
