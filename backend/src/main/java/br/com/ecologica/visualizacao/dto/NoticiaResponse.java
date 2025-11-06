package br.com.ecologica.visualizacao.dto;

import br.com.ecologica.visualizacao.ExibicaoNoticias;
import lombok.Data;
import java.time.LocalDate;

@Data
public class NoticiaResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private String autor; 
    private LocalDate dataPublicacao;
  

    public static NoticiaResponse fromEntity(ExibicaoNoticias noticia) {
        NoticiaResponse response = new NoticiaResponse();
        response.setId(noticia.getId());
        response.setTitulo(noticia.getTitulo());
        response.setConteudo(noticia.getConteudo());
        response.setAutor(noticia.getAutor()); //
        response.setDataPublicacao(noticia.getDataPublicacao());
        return response;
    }
}