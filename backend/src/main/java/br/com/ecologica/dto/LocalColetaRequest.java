package br.com.ecologica.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocalColetaRequest {
	@NotBlank(message = "O nome do local é obrigatório")
	private String nome;
	private String endereco;
}