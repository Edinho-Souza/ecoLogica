package br.com.ecologica.dto;

import br.com.ecologica.model.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipoUsuario;
}
