package br.com.ecologica.pontuacao.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PontuacaoRequest {

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long idUsuario;

    @Min(value = 1, message = "A quantidade de pontos deve ser positiva")
    private int pontos;

    @NotBlank(message = "A atividade (motivo) é obrigatória")
    private String atividade;
}