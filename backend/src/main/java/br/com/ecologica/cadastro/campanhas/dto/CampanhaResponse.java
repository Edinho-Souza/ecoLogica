package br.com.ecologica.cadastro.campanhas.dto;

import lombok.Data;

@Data
public class CampanhaResponse {

    private Long id;
    private String nomeCampanha;
    private String descricao;
    private boolean ativa;

    public static CampanhaResponse fromEntity(br.com.ecologica.cadastro.CadastroCampanhas campanha) {
        CampanhaResponse response = new CampanhaResponse();
        response.setId(campanha.getId());
        response.setNomeCampanha(campanha.getNomeCampanha());
        response.setDescricao(campanha.getDescricao());
        response.setAtiva(campanha.isAtiva());
        return response;
    }
}