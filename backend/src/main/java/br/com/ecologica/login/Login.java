package br.com.ecologica.login;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "login")
public class Login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String senha;

    public boolean autenticar(String email, String senha) {
        // lógica de autenticação (exemplo simplificado)
        return this.email.equals(email) && this.senha.equals(senha);
    }
}