package br.com.ecologica.cadastro.empresasapoiadoras.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmpresaApoiadoraRequest {

    @NotBlank(message = "O nome da empresa é obrigatório")
    private String nomeEmpresa;

    @NotBlank(message = "O CNPJ é obrigatório")
    private String cnpj;

    private String contato;
    private boolean ativa;
}
