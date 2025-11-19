package br.com.ecologica.dto;

import br.com.ecologica.visualizacao.VisualizacaoEstatisticas;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EstatisticaResponse {
    private Long id;
    private Long idUsuario;
    private String tipo;
    private BigDecimal valor;
    private LocalDate data;

    public static EstatisticaResponse fromEntity(VisualizacaoEstatisticas e) {
        EstatisticaResponse response = new EstatisticaResponse();
        response.setId(e.getId());
        response.setTipo(e.getTipo());
        response.setValor(e.getValor());
        response.setData(e.getData());
        if (e.getUsuario() != null) {
            response.setIdUsuario(e.getUsuario().getId());
        }
        return response;
    }
}