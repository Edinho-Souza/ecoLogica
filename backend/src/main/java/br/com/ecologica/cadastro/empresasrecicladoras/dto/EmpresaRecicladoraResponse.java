package br.com.ecologica.cadastro.empresasrecicladoras.dto;

import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.CadastroTipoMateriais;
import lombok.Data;

@Data
public class EmpresaRecicladoraResponse {
    private Long id;
    private String nomeEmpresa;
    private String cidade;
    private String tipoMaterial;
    private boolean ativa;
    private boolean aprovada;

    public static EmpresaRecicladoraResponse fromEntity(CadastroEmpresasRecicladoras empresa) {
        EmpresaRecicladoraResponse response = new EmpresaRecicladoraResponse();
        response.setId(empresa.getId());
        response.setNomeEmpresa(empresa.getNomeEmpresa());
        response.setCidade(empresa.getCidade());
        response.setTipoMaterial(empresa.getTiposMateriais() != null
                ? empresa.getTiposMateriais().stream()
                    .map(CadastroTipoMateriais::getNomeTipo)
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("")
                : "");
        response.setAtiva(empresa.isAtiva());
        response.setAprovada(empresa.isAprovada());
        return response;
    }
}