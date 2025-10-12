package br.com.ecologica.cadastro;

public class CadastroUsuarios {

	// Atributos do usuário
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

	// Getters e Setters
	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getCpf() {
		return cpf;
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
