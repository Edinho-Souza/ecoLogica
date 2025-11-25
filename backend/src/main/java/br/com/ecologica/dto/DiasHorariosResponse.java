package br.com.ecologica.dto;

import lombok.Data;

@Data
public class DiasHorariosResponse {

    private Long id;
    private String diaSemana;
    private String horarioInicio;
    private String horarioFim;
    private boolean ativo;

    public static DiasHorariosResponse fromEntity(br.com.ecologica.cadastros.CadastroDiasHorarios horario) {
        DiasHorariosResponse response = new DiasHorariosResponse();
        response.setId(horario.getId());
        response.setDiaSemana(horario.getDiaSemana());
        response.setHorarioInicio(horario.getHorarioInicio());
        response.setHorarioFim(horario.getHorarioFim());
        response.setAtivo(horario.isAtivo());
        return response;
    }
}