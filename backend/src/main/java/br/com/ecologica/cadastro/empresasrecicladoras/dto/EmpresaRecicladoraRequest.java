package br.com.ecologica.cadastro.empresasrecicladoras.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmpresaRecicladoraRequest {

    @NotBlank(message = "O nome da empresa é obrigatório")
    private String nomeEmpresa;

    private String cidade;
    private String tipoMaterial;
    private boolean ativa;
}