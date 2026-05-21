package br.com.ecologica.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class LocalColetaRequest {
    @NotBlank(message = "O nome do local e obrigatorio")
    private String nome;
    private String endereco;
    private String cidade;
    private Double latitude;
    private Double longitude;
    private Long idRecicladora;
    private List<Long> tiposMateriaisIds;
}
