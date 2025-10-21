package br.com.ecologica.cadastro.tipomateriais.dto;

import lombok.Data;

@Data
public class TipoMaterialResponse {
    private Long id;
    private String nomeTipo;
    private String descricao;
    private boolean ativo;

    // Construtor estático para facilitar conversão
    public static TipoMaterialResponse fromEntity(br.com.ecologica.cadastro.CadastroTipoMateriais tipo) {
        TipoMaterialResponse response = new TipoMaterialResponse();
        response.setId(tipo.getId());
        response.setNomeTipo(tipo.getNomeTipo());
        response.setDescricao(tipo.getDescricao());
        response.setAtivo(tipo.isAtivo());
        return response;
    }
}