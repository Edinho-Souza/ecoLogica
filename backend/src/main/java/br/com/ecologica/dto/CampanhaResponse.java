package br.com.ecologica.dto;

import br.com.ecologica.cadastros.CadastroCampanhas;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CampanhaResponse {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Long idApoiadora;
    private String nomeEmpresaApoiadora;
    private String imagemUrl;
    private Integer pontosExtras;

    public static CampanhaResponse fromEntity(CadastroCampanhas campanha) {
        CampanhaResponse response = new CampanhaResponse();
        response.setId(campanha.getId());
        response.setTitulo(campanha.getTitulo());
        response.setDescricao(campanha.getDescricao());
        response.setDataInicio(campanha.getDataInicio());
        response.setDataFim(campanha.getDataFim());
        response.setImagemUrl(campanha.getImagemUrl());
        response.setPontosExtras(campanha.getPontosExtras());

        if (campanha.getEmpresaApoiadora() != null) {
            response.setIdApoiadora(campanha.getEmpresaApoiadora().getId());
            if (campanha.getEmpresaApoiadora().getUsuario() != null) {
                response.setNomeEmpresaApoiadora(campanha.getEmpresaApoiadora().getUsuario().getNome());
            }
        }
        return response;
    }
}
