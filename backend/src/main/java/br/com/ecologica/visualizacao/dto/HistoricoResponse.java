package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.HistoricoPontuacao;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HistoricoResponse {
    private Long id;
    private Long usuarioId;
    private String acao;
    private LocalDateTime data;

    public static HistoricoResponse fromEntity(HistoricoPontuacao historico) {
        HistoricoResponse response = new HistoricoResponse();
        response.setId(historico.getId());
        response.setAcao(historico.getAcao());
        response.setData(historico.getData());
        if (historico.getUsuario() != null) {
            response.setUsuarioId(historico.getUsuario().getId());
        }
        return response;
    }
}