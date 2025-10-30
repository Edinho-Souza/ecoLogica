package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import lombok.Data;

@Data
public class RankingResponse {
    private Long id;
    private String nomeUsuario;
    private int pontuacao;
    private int posicao;

    public static RankingResponse fromEntity(ExibicaoRanking ranking) {
        RankingResponse response = new RankingResponse();
        response.setId(ranking.getId());
        response.setNomeUsuario(ranking.getNomeUsuario());
        response.setPontuacao(ranking.getPontuacao());
        response.setPosicao(ranking.getPosicao());
        return response;
    }
}