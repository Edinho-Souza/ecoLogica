package br.com.ecologica.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PontuacaoRequest {

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long idUsuario;

    private int pontos;

    @NotBlank(message = "A atividade (motivo) é obrigatória")
    private String atividade;
}
