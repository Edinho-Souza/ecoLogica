package br.com.ecologica.dto;

import br.com.ecologica.gestao.GestaoConteudo;
import lombok.Data;

@Data
public class GestaoConteudoResponse {
    private Long id;
    private String tipoConteudo;
    private String titulo;
    private String descricao;
    private boolean publicado;

    public static GestaoConteudoResponse fromEntity(GestaoConteudo conteudo) {
        GestaoConteudoResponse response = new GestaoConteudoResponse();
        response.setId(conteudo.getId());
        response.setTipoConteudo(conteudo.getTipoConteudo());
        response.setTitulo(conteudo.getTitulo());
        response.setDescricao(conteudo.getDescricao());
        response.setPublicado(conteudo.isPublicado());
        return response;
    }
}