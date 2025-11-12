package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
public class CadastroUsuarios {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nome;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String senha;

	private String telefone;

	@Column(nullable = false, unique = true)
	private String cpf;

	public void exibirDados() {
		System.out.println("Nome: " + nome);
		System.out.println("Email: " + email);
		System.out.println("Telefone: " + telefone);
		System.out.println("CPF: " + cpf);
	}

	public boolean validarCadastro() {
		return nome != null && !nome.isEmpty() && email != null && email.contains("@") && senha != null
				&& senha.length() >= 6;
	}
}