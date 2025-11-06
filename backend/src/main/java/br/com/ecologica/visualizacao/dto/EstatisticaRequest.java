package br.com.ecologica.visualizacao.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EstatisticaRequest {
    private Long idUsuario;
    private String tipo;
    private BigDecimal valor;
    private LocalDate data;
}