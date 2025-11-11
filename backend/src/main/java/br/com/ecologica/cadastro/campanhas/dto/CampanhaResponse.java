package br.com.ecologica.cadastro.campanhas.dto;

import br.com.ecologica.cadastro.CadastroCampanhas;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CampanhaResponse {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String nomeEmpresaApoiadora;

    public static CampanhaResponse fromEntity(CadastroCampanhas campanha) {
        CampanhaResponse response = new CampanhaResponse();
        response.setId(campanha.getId());
        response.setTitulo(campanha.getTitulo());
        response.setDescricao(campanha.getDescricao());
        response.setDataInicio(campanha.getDataInicio());
        response.setDataFim(campanha.getDataFim());

        if (campanha.getEmpresaApoiadora() != null && 
            campanha.getEmpresaApoiadora().getUsuario() != null) {
            response.setNomeEmpresaApoiadora(campanha.getEmpresaApoiadora().getUsuario().getNome());
        }
        return response;
    }
}