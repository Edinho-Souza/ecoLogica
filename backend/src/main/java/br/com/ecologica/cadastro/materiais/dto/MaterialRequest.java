package br.com.ecologica.cadastro.materiais.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MaterialRequest {

    @NotBlank(message = "O nome do material é obrigatório")
    private String nomeMaterial;

    private String tipoMaterial;
    private String descricao;
    private boolean reciclavel;
}