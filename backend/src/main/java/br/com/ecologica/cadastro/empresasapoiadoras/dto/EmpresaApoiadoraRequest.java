package br.com.ecologica.cadastro.empresasapoiadoras.dto;

import br.com.ecologica.validacao.ValidadorCNPJ;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmpresaApoiadoraRequest {


    @NotBlank(message = "O CNPJ é obrigatório")
    private String cnpj;
    
    private String endereco;
    private String telefone;

    public boolean isCnpjValido() {
        return ValidadorCNPJ.isCNPJValido(cnpj);
    }
}