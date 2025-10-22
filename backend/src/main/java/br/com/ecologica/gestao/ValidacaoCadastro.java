package br.com.ecologica.gestao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "validacao_cadastro")
public class ValidacaoCadastro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String cpf;
    private boolean valido;

    public boolean validarEmail() {
        return email != null && email.contains("@");
    }

    public boolean validarCpf() {
        return cpf != null && cpf.length() == 11;
    }
}