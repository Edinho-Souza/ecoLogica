package br.com.ecologica.cadastro.materiais.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MaterialRequest {
    @NotBlank(message = "O nome do material é obrigatório")
    private String nomeMaterial;
    private String tipoMaterial; // Nome do tipo
    private String descricao;
    private boolean reciclavel;
    private Long localColetaId; // ID do local de coleta
}
