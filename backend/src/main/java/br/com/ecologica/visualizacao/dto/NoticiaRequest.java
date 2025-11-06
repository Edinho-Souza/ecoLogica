package br.com.ecologica.visualizacao.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class NoticiaRequest {
    @NotBlank
    private String titulo;
    private String conteudo;
    private LocalDate dataPublicacao;
    private String autor;
}