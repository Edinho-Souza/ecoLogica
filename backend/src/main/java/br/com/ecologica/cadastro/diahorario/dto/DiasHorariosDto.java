package br.com.ecologica.cadastro.diahorario.dto;

import lombok.Data;

@Data
public class DiasHorariosDto {

    private Long id;
    private String diaSemana;
    private String horarioInicio;
    private String horarioFim;
    private boolean ativo;
}