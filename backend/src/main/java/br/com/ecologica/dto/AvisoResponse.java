package br.com.ecologica.dto;

import br.com.ecologica.gestao.GestaoConteudo;
import lombok.Data;

@Data
public class AvisoResponse {
    private Long id;
    private String texto;
    private String tipo;
    private boolean ativo;

    public static AvisoResponse fromEntity(GestaoConteudo aviso) {
        AvisoResponse response = new AvisoResponse();
        response.setId(aviso.getId());
        response.setTexto(aviso.getDescricao());
        response.setTipo(aviso.getTitulo());
        response.setAtivo(aviso.isPublicado());
        return response;
    }
}
