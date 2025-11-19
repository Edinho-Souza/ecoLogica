package br.com.ecologica.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TipoMateriaisRequest {

    @NotBlank(message = "O nome do tipo é obrigatório")
    private String nomeTipo;
    private String descricao;
    private boolean ativo;
}