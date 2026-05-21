package br.com.ecologica.dto;

import br.com.ecologica.model.StatusUsuario;
import br.com.ecologica.model.TipoUsuario;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UsuarioUpdateRequest {
    private String nome;

    @Email(message = "E-mail invalido")
    private String email;

    private String senha;
    private String cpf;
    private TipoUsuario tipoUsuario;
    private StatusUsuario status;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String fotoPerfil;
}
