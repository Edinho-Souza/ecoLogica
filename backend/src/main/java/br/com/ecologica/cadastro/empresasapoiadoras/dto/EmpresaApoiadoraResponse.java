package br.com.ecologica.cadastro.empresasapoiadoras.dto;

import lombok.Data;

@Data
public class EmpresaApoiadoraResponse {

    private Long id;
    private String nomeEmpresa;
    private String cnpj;
    private String contato;
    private boolean ativa;

    public static EmpresaApoiadoraResponse fromEntity(br.com.ecologica.cadastro.CadastroEmpresasApoiadoras empresa) {
        EmpresaApoiadoraResponse response = new EmpresaApoiadoraResponse();
        response.setId(empresa.getId());
        response.setNomeEmpresa(empresa.getNomeEmpresa());
        response.setCnpj(empresa.getCnpj());
        response.setContato(empresa.getContato());
        response.setAtiva(empresa.isAtiva());
        return response;
    }
}