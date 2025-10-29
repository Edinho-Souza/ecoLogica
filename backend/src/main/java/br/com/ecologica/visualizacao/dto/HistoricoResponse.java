package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.HistoricoPontuacao;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class HistoricoResponse {
    private Long usuarioId;
    private List<Integer> pontuacoes;
    private LocalDateTime ultimaAtualizacao;

    public static HistoricoResponse fromEntity(HistoricoPontuacao historico) {
        HistoricoResponse response = new HistoricoResponse();
        response.setUsuarioId(historico.getUsuarioId());
        response.setPontuacoes(historico.getPontuacoes());
        response.setUltimaAtualizacao(historico.getUltimaAtualizacao());
        return response;
    }
}