package br.com.ecologica.dto;

import br.com.ecologica.model.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipoUsuario; 
}