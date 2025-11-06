package br.com.ecologica.cadastro.usuarios.dto;

import br.com.ecologica.cadastro.usuarios.model.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UsuarioRequest {

	@NotBlank(message = "O nome é obrigatório")
	private String nome;

	@NotBlank(message = "O CPF é obrigatório")
	@Pattern(regexp = "\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}", message = "O CPF deve estar no formato 000.000.000-00")
	private String cpf;

	@Email(message = "E-mail inválido")
	@NotBlank(message = "O e-mail é obrigatório")
	private String email;

	@NotBlank(message = "A senha é obrigatória")
	private String senha;

	@NotNull(message = "O tipo de usuário é obrigatório")
	private TipoUsuario tipoUsuario;

	private String cnpj;
	private String endereco;
	private String telefone;
}