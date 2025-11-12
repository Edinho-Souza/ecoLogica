package br.com.ecologica.cadastro.materiais.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MaterialRequest {
    @NotBlank(message = "O nome do material é obrigatório")
    private String nomeMaterial;

    @NotNull(message = "O ID do tipo de material é obrigatório")
    private Long tipoMaterialId;

    private String descricao;
    private boolean reciclavel;

    @NotNull(message = "O ID do local de coleta é obrigatório")
    private Long localColetaId;
}