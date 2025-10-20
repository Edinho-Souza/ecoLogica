package br.com.ecologica.cadastro;
import lombok.Data;

@Data
public class CadastroUsuarios {
	private String nome;
	private String email;
	private String senha;
	private String telefone;
	private String cpf;

	// Construtor
	public CadastroUsuarios(String nome, String email, String senha, String telefone, String cpf) {
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.telefone = telefone;
		this.cpf = cpf;
	}

	// Método para exibir os dados do usuário
	public void exibirDados() {
	    System.out.println("Nome: " + nome);
	    System.out.println("Email: " + email);
	    System.out.println("Telefone: " + telefone);
	    System.out.println("CPF: " + cpf);
	}

	// Método para validar o cadastro
	public boolean validarCadastro() {
		return nome != null && !nome.isEmpty() && email != null && email.contains("@") && senha != null
				&& senha.length() >= 6;
	}
}
