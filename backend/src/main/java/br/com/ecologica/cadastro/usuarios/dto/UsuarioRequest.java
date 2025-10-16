package br.com.ecologica.cadastro.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioRequest {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "O e-mail é obrigatório")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    private String senha;

    @NotBlank(message = "O perfil é obrigatório")
    private String perfil;
}
