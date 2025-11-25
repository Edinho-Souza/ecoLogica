package br.com.ecologica.dto;

import br.com.ecologica.cadastros.CadastroEmpresasApoiadoras;
import br.com.ecologica.model.StatusUsuario;
import lombok.Data;

@Data
public class EmpresaApoiadoraResponse {

    private Long id; 
    private String nomeEmpresa; 
    private String email; 
    private StatusUsuario status; 
    private String cnpj;
    private String endereco;
    private String telefone;

    // Método de conversão
    public static EmpresaApoiadoraResponse fromEntity(CadastroEmpresasApoiadoras empresa) {
        EmpresaApoiadoraResponse response = new EmpresaApoiadoraResponse();
        
        // Dados do Usuario
        response.setId(empresa.getUsuario().getId());
        response.setNomeEmpresa(empresa.getUsuario().getNome());
        response.setEmail(empresa.getUsuario().getEmail());
        response.setStatus(empresa.getUsuario().getStatus());

        // Dados da EmpresaApoiadora
        response.setCnpj(empresa.getCnpj());
        response.setEndereco(empresa.getEndereco());
        response.setTelefone(empresa.getTelefone());

        return response;
    }
}