package br.com.ecologica.cadastro.empresasrecicladoras.dto;

import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.usuarios.model.StatusUsuario;
import lombok.Data;

@Data
public class EmpresaRecicladoraResponse {
    
    private Long id;
    private String nomeEmpresa;
    private String email;
    private StatusUsuario status;
    private String cnpj;
    private String endereco;
    private String telefone;

    public static EmpresaRecicladoraResponse fromEntity(CadastroEmpresasRecicladoras empresa) {
        EmpresaRecicladoraResponse response = new EmpresaRecicladoraResponse();

        if (empresa.getUsuario() != null) {
            // Dados do Usuario
            response.setId(empresa.getUsuario().getId());
            response.setNomeEmpresa(empresa.getUsuario().getNome());
            response.setEmail(empresa.getUsuario().getEmail());
            response.setStatus(empresa.getUsuario().getStatus());
        }
        
        // Dados da EmpresaRecicladora
        response.setCnpj(empresa.getCnpj());
        response.setEndereco(empresa.getEndereco());
        response.setTelefone(empresa.getTelefone());
        
        return response;
    }
}