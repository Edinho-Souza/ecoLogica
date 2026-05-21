package br.com.ecologica.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CampanhaRequest {

    @NotBlank(message = "O titulo e obrigatorio")
    private String titulo;

    private String descricao;

    @NotNull(message = "A data de inicio e obrigatoria")
    private LocalDate dataInicio;

    @NotNull(message = "A data de fim e obrigatoria")
    @FutureOrPresent(message = "A data de fim nao pode ser no passado")
    private LocalDate dataFim;

    @NotNull(message = "O ID da empresa apoiadora e obrigatorio")
    private Long idApoiadora;

    private String imagemUrl;
    private Integer pontosExtras;
}
