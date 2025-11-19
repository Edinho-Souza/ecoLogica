package br.com.ecologica.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GestaoConteudoRequest {
    @NotBlank(message = "O tipo de conteúdo é obrigatório")
    private String tipoConteudo;

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    private String descricao;
    private boolean publicado;
}