package br.com.ecologica.cadastro.diahorario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DiasHorariosRequest {

    @NotBlank(message = "O dia da semana é obrigatório")
    private String diaSemana;
    private String horarioInicio;
    private String horarioFim;
    private boolean ativo;
    
    public String getDiaSemana() {
        return diaSemana;
    }
    
    public String getHorarioInicio() {
        return horarioInicio;
    }
    
    public String getHorarioFim() {
        return horarioFim;
    }
    
    public boolean isAtivo() {
        return ativo;
    }
}