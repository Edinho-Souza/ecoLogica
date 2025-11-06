package br.com.ecologica.cadastro.usuarios.dto;

import br.com.ecologica.cadastro.usuarios.model.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipoUsuario; 
}