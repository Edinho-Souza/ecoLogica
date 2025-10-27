package br.com.ecologica.cadastro.materiais.dto;

import lombok.Data;

@Data
public class MaterialDto {

    private Long id;
    private String nomeMaterial;
    private String tipoMaterial;
    private String descricao;
    private boolean reciclavel;
}