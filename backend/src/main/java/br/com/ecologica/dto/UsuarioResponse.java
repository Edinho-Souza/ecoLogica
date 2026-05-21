package br.com.ecologica.dto;

import br.com.ecologica.model.StatusUsuario;
import br.com.ecologica.model.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private TipoUsuario tipoUsuario;
    private StatusUsuario status;
    private int pontos;
    private String fotoPerfil;
}
