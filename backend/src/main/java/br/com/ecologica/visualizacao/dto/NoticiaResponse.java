package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.ExibicaoNoticias;
import lombok.Data;

@Data
public class NoticiaResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private String fonte;
    private boolean publicado;

    public static NoticiaResponse fromEntity(ExibicaoNoticias noticia) {
        NoticiaResponse response = new NoticiaResponse();
        response.setId(noticia.getId());
        response.setTitulo(noticia.getTitulo());
        response.setConteudo(noticia.getConteudo());
        response.setFonte(noticia.getFonte());
        response.setPublicado(noticia.isPublicado());
        return response;
    }
}
