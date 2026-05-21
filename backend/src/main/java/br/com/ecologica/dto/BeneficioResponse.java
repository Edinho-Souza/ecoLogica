package br.com.ecologica.dto;

import br.com.ecologica.cadastros.CadastroBeneficios;
import lombok.Data;

@Data
public class BeneficioResponse {
    private Long id;
    private String titulo;
    private String descricao;
    private int pontosNecessarios;
    private String imagemUrl;
    private Integer estoque;

    public static BeneficioResponse fromEntity(CadastroBeneficios beneficio) {
        BeneficioResponse response = new BeneficioResponse();
        response.setId(beneficio.getId());
        response.setTitulo(beneficio.getTitulo());
        response.setDescricao(beneficio.getDescricao());
        response.setPontosNecessarios(beneficio.getPontosNecessarios());
        response.setImagemUrl(beneficio.getImagemUrl());
        response.setEstoque(beneficio.getEstoque());
        return response;
    }
}
