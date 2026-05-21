package br.com.ecologica.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AvisoRequest {
    @NotBlank(message = "O texto do aviso e obrigatorio")
    private String texto;

    @NotBlank(message = "O tipo do aviso e obrigatorio")
    private String tipo;
}
