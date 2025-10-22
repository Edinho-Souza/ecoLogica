package br.com.ecologica.cadastro.beneficios.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BeneficioRequest {

    @NotBlank(message = "O nome do benefício é obrigatório")
    private String nomeBeneficio;

    private String descricao;
    private boolean ativo;
}