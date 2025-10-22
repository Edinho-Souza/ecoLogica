package br.com.ecologica.login;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "recuperacao_senha_login")
public class RecuperacaoSenhaLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String codigoRecuperacao;
    private boolean validado;

    public void recuperarSenha() {
        // lógica para envio de código de recuperação
    }

    public boolean validarCodigo(String codigo) {
        // lógica para validar o código recebido
        return this.codigoRecuperacao != null && this.codigoRecuperacao.equals(codigo);
    }
}