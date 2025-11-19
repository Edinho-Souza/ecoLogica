package br.com.ecologica.dto;

import br.com.ecologica.validacao.ValidadorCNPJ;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmpresaApoiadoraRequest {
	@NotBlank(message = "O CNPJ é obrigatório")
	private String cnpj;
	private String endereco;
	private String telefone;
}