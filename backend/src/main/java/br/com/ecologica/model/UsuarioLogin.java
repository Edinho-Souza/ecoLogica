package br.com.ecologica.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioLogin {
    @Email(message = "E-mail invalido")
    @NotBlank(message = "O e-mail e obrigatorio")
    private String email;

    @NotBlank(message = "A senha e obrigatoria")
    private String senha;
}
