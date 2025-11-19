package br.com.ecologica.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CampanhaRequest {

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    private String descricao;

    @NotNull(message = "A data de início é obrigatória")
    private LocalDate dataInicio;

    @NotNull(message = "A data de fim é obrigatória")
    @FutureOrPresent(message = "A data de fim não pode ser no passado")
    private LocalDate dataFim;

    @NotNull(message = "O ID da empresa apoiadora é obrigatório")
    private Long idApoiadora;
}