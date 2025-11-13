package br.com.ecologica.cadastro.diahorario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DiasHorariosRequest {
	@NotNull(message = "O ID do local de coleta é obrigatório")
	private Long localColetaId; 
	@NotBlank(message = "O dia da semana é obrigatório")
	private String diaSemana;
	private String horarioInicio;
	private String horarioFim;
	private boolean ativo;
}