package br.com.ecologica.login.model;

import lombok.Data;

@Data
public class UsuarioLogin {
    private String email;
    private String senha;
}