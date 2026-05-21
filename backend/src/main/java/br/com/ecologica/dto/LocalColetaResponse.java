package br.com.ecologica.dto;

import lombok.Data;
import java.util.List; 
import java.util.stream.Collectors;

import br.com.ecologica.cadastros.CadastroLocaisColeta;
import br.com.ecologica.cadastros.CadastroTipoMateriais; 

@Data
public class LocalColetaResponse {
    private Long id;
    private String nome;
    private String endereco;
    private String cidade;
    private Double latitude;
    private Double longitude;
    private Long idRecicladora;
    private String nomeRecicladora;
    private List<Long> tiposMateriaisIds;
    private List<String> tiposMateriaisAceitos; 

    public static LocalColetaResponse fromEntity(CadastroLocaisColeta local) {
        LocalColetaResponse response = new LocalColetaResponse();
        response.setId(local.getId());
        response.setNome(local.getNome());
        response.setEndereco(local.getEndereco());
        response.setCidade(local.getCidade());
        response.setLatitude(local.getLatitude());
        response.setLongitude(local.getLongitude());
        if (local.getEmpresaRecicladora() != null) {
            response.setIdRecicladora(local.getEmpresaRecicladora().getId());
            if (local.getEmpresaRecicladora().getUsuario() != null) {
                response.setNomeRecicladora(local.getEmpresaRecicladora().getUsuario().getNome());
            }
        }
        // Mapeia os nomes dos tipos de materiais
        if (local.getTiposMateriaisAceitos() != null) {
            response.setTiposMateriaisIds(
                local.getTiposMateriaisAceitos().stream()
                    .map(CadastroTipoMateriais::getId)
                    .collect(Collectors.toList())
            );
            response.setTiposMateriaisAceitos(
                local.getTiposMateriaisAceitos().stream()
                    .map(CadastroTipoMateriais::getNomeTipo)
                    .collect(Collectors.toList())
            );
        }
        return response;
    }
}
