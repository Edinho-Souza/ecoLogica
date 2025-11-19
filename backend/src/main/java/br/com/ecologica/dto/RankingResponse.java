package br.com.ecologica.dto;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import lombok.Data;

@Data
public class RankingResponse {
    private Long id;
    private String nomeUsuario;
    private int pontos;
    private int posicao;

    public static RankingResponse fromEntity(ExibicaoRanking ranking) {
        RankingResponse response = new RankingResponse();
        response.setId(ranking.getId());
        response.setPontos(ranking.getPontos());
        response.setPosicao(ranking.getPosicao());
        
        if (ranking.getUsuario() != null) {
            response.setNomeUsuario(ranking.getUsuario().getNome());
        }
        
        return response;
    }
}