package br.com.ecologica.dto;

import br.com.ecologica.model.StatusSolicitacao;
import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SolicitacaoResponse {
    private Long id;
    private String descricao;
    private StatusSolicitacao status;
    private LocalDateTime dataSolicitacao;
    private Long idUsuario;
    private Long idRecicladora;
    private String nomeUsuario;
    private String nomeRecicladora;

    public static SolicitacaoResponse fromEntity(VisualizacaoSolicitacoes s) {
        SolicitacaoResponse response = new SolicitacaoResponse();
        response.setId(s.getId());
        response.setDescricao(s.getDescricao());
        response.setStatus(s.getStatus());
        response.setDataSolicitacao(s.getDataSolicitacao());
        
        if (s.getUsuario() != null) {
            response.setIdUsuario(s.getUsuario().getId());
            response.setNomeUsuario(s.getUsuario().getNome());
        }
        if (s.getEmpresaRecicladora() != null) {
            response.setIdRecicladora(s.getEmpresaRecicladora().getId());
            if (s.getEmpresaRecicladora().getUsuario() != null) {
                response.setNomeRecicladora(s.getEmpresaRecicladora().getUsuario().getNome());
            }
        }
        
        return response;
    }
}
