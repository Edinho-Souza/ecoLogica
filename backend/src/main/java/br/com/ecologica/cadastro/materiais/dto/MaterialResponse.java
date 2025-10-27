package br.com.ecologica.cadastro.materiais.dto;

import lombok.Data;

@Data
public class MaterialResponse {

    private Long id;
    private String nomeMaterial;
    private String tipoMaterial;
    private String descricao;
    private boolean reciclavel;

    public static MaterialResponse fromEntity(br.com.ecologica.cadastro.CadastroMateriaisColetar material) {
        MaterialResponse response = new MaterialResponse();
        response.setId(material.getId());
        response.setNomeMaterial(material.getNomeMaterial());
        response.setTipoMaterial(material.getTipoMaterial());
        response.setDescricao(material.getDescricao());
        response.setReciclavel(material.isReciclavel());
        return response;
    }
}