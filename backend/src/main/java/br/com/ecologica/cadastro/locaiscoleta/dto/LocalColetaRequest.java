package br.com.ecologica.cadastro.locaiscoleta.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LocalColetaRequest {

    @NotBlank(message = "O nome do local é obrigatório")
    private String nomeLocal;

    private String endereco;
    private String cidade;
    private String estado;
    private String horarioFuncionamento;
    private boolean ativo;
}