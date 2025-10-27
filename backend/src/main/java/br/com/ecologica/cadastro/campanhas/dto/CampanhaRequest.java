package br.com.ecologica.cadastro.campanhas.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CampanhaRequest {

    @NotBlank(message = "O nome da campanha é obrigatório")
    private String nomeCampanha;

    private String descricao;
    private boolean ativa;
}