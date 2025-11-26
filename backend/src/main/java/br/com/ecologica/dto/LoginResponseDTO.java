package br.com.ecologica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor 
public class LoginResponseDTO {
    private String token;
    private String nome;
    private String tipoUsuario;
}