package br.com.ecologica.visualizacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SolicitacaoRequest {
    
    @NotNull(message = "O ID do usuário é obrigatório")
    private Long idUsuario;

    @NotNull(message = "O ID da recicladora é obrigatório")
    private Long idRecicladora;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

}