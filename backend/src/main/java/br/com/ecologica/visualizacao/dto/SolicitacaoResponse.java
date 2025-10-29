package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;
import lombok.Data;

@Data
public class SolicitacaoResponse {
    private Long id;
    private String tipoSolicitacao;
    private String status;

    public static SolicitacaoResponse fromEntity(VisualizacaoSolicitacoes solicitacao) {
        SolicitacaoResponse response = new SolicitacaoResponse();
        response.setId(solicitacao.getId());
        response.setTipoSolicitacao(solicitacao.getTipoSolicitacao());
        response.setStatus(solicitacao.getStatus());
        return response;
    }
}