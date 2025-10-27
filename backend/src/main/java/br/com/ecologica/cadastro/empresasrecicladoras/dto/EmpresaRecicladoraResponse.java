package br.com.ecologica.cadastro.empresasrecicladoras.dto;

import lombok.Data;

@Data
public class EmpresaRecicladoraResponse {

    private Long id;
    private String nomeEmpresa;
    private String cidade;
    private String tipoMaterial;
    private boolean ativa;
    private boolean aprovada;

    public static EmpresaRecicladoraResponse fromEntity(br.com.ecologica.cadastro.CadastroEmpresasRecicladoras empresa) {
        EmpresaRecicladoraResponse response = new EmpresaRecicladoraResponse();
        response.setId(empresa.getId());
        response.setNomeEmpresa(empresa.getNomeEmpresa());
        response.setCidade(empresa.getCidade());
        response.setTipoMaterial(empresa.getTipoMaterial()); // Certifique-se que esse getter existe
        response.setAtiva(empresa.isAtiva());
        response.setAprovada(empresa.isAprovada());
        return response;
    }
}