package br.com.ecologica.dto;

import lombok.Data;

@Data
public class TipoMaterialResponse {
    private Long id;
    private String nomeTipo;
    private String descricao;
    private boolean ativo;

    // Construtor estático para conversão
    public static TipoMaterialResponse fromEntity(br.com.ecologica.CadastroTipoMateriais tipo) {
        TipoMaterialResponse response = new TipoMaterialResponse();
        response.setId(tipo.getId());
        response.setNomeTipo(tipo.getNomeTipo());
        response.setDescricao(tipo.getDescricao());
        response.setAtivo(tipo.isAtivo());
        return response;
    }
}