package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.ExibicaoOrientacoes;
import lombok.Data;

@Data
public class OrientacaoResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private boolean ativo;

    public static OrientacaoResponse fromEntity(ExibicaoOrientacoes orientacao) {
        OrientacaoResponse response = new OrientacaoResponse();
        response.setId(orientacao.getId());
        response.setTitulo(orientacao.getTitulo());
        response.setConteudo(orientacao.getConteudo());
        response.setAtivo(orientacao.isAtivo());
        return response;
    }
}