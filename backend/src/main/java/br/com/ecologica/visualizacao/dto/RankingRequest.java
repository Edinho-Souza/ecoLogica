package br.com.ecologica.visualizacao.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RankingRequest {
    
    @NotNull(message = "O ID do usuário é obrigatório")
    private Long idUsuario;

    @NotNull(message = "A pontuação é obrigatória")
    private Integer pontos;
    
    private Integer posicao;
}