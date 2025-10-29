package br.com.ecologica.pontuacao.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PontuacaoResponse {
    private Long usuarioId;
    private int pontosTotal;
    private String atividade;
    private LocalDateTime dataRegistro;
}