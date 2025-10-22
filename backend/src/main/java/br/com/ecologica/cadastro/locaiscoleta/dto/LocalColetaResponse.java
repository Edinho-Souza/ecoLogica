package br.com.ecologica.cadastro.locaiscoleta.dto;

import lombok.Data;

@Data
public class LocalColetaResponse {

    private Long id;
    private String nomeLocal;
    private String endereco;
    private String cidade;
    private String estado;
    private String horarioFuncionamento;
    private boolean ativo;

    public static LocalColetaResponse fromEntity(br.com.ecologica.cadastro.CadastroLocaisColeta local) {
        LocalColetaResponse response = new LocalColetaResponse();
        response.setId(local.getId());
        response.setNomeLocal(local.getNomeLocal());
        response.setEndereco(local.getEndereco());
        response.setCidade(local.getCidade());
        response.setEstado(local.getEstado());
        response.setHorarioFuncionamento(local.getHorarioFuncionamento());
        response.setAtivo(local.isAtivo());
        return response;
    }
}