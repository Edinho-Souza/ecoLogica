package br.com.ecologica.cadastro.usuarios.dto;

import lombok.Data;

@Data
public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;
    private String perfil;

}
