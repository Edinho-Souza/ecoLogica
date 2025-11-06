package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;
import br.com.ecologica.visualizacao.model.StatusSolicitacao;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SolicitacaoResponse {
    private Long id;
    private String descricao;
    private StatusSolicitacao status;
    private LocalDateTime dataSolicitacao;
    private String nomeUsuario;
    private String nomeRecicladora;

    public static SolicitacaoResponse fromEntity(VisualizacaoSolicitacoes s) {
        SolicitacaoResponse response = new SolicitacaoResponse();
        response.setId(s.getId());
        response.setDescricao(s.getDescricao());
        response.setStatus(s.getStatus());
        response.setDataSolicitacao(s.getDataSolicitacao());
        
        if (s.getUsuario() != null) {
            response.setNomeUsuario(s.getUsuario().getNome());
        }
        if (s.getEmpresaRecicladora() != null && s.getEmpresaRecicladora().getUsuario() != null) {
            response.setNomeRecicladora(s.getEmpresaRecicladora().getUsuario().getNome());
        }
        
        return response;
    }
}