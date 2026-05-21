package br.com.ecologica.dto;

import br.com.ecologica.model.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRequest {

    @NotBlank(message = "O nome e obrigatorio")
    private String nome;

    // CPF e obrigatorio apenas para cidadao; empresas usam CNPJ.
    private String cpf;

    @Email(message = "E-mail invalido")
    @NotBlank(message = "O e-mail e obrigatorio")
    private String email;

    @NotBlank(message = "A senha e obrigatoria")
    private String senha;

    @NotNull(message = "O tipo de usuario e obrigatorio")
    private TipoUsuario tipoUsuario;

    private String cnpj;
    private String endereco;
    private String telefone;
}
