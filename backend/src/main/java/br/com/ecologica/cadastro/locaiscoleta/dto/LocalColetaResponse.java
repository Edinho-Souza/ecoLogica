package br.com.ecologica.cadastro.locaiscoleta.dto;

import br.com.ecologica.cadastro.CadastroLocaisColeta;
import lombok.Data;

@Data
public class LocalColetaResponse {
    private Long id;
    private String nome;
    private String endereco;
    private Long idRecicladora;
    private String nomeRecicladora; 

    public static LocalColetaResponse fromEntity(CadastroLocaisColeta local) {
        LocalColetaResponse response = new LocalColetaResponse();
        response.setId(local.getId());
        response.setNome(local.getNome());
        response.setEndereco(local.getEndereco());

        if (local.getEmpresaRecicladora() != null) {
            response.setIdRecicladora(local.getEmpresaRecicladora().getId());

            if (local.getEmpresaRecicladora().getUsuario() != null) {
                response.setNomeRecicladora(local.getEmpresaRecicladora().getUsuario().getNome());
            }
        }
        return response;
    }
}