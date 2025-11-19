package br.com.ecologica.dto;

import br.com.ecologica.CadastroBeneficios;
import lombok.Data;

@Data
public class BeneficioResponse {
    private Long id;
    private String titulo;
    private String descricao;
    private int pontosNecessarios; 

    public static BeneficioResponse fromEntity(CadastroBeneficios beneficio) {
        BeneficioResponse response = new BeneficioResponse();
        response.setId(beneficio.getId());
        response.setTitulo(beneficio.getTitulo()); 
        response.setDescricao(beneficio.getDescricao());
        response.setPontosNecessarios(beneficio.getPontosNecessarios()); 
        return response;
    }
}