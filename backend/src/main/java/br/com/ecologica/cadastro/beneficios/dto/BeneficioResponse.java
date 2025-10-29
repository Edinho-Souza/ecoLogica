package br.com.ecologica.cadastro.beneficios.dto;

import br.com.ecologica.cadastro.CadastroBeneficios;
import lombok.Data;

@Data
public class BeneficioResponse {
    private Long id;
    private String nomeBeneficio;
    private String descricao;
    private boolean ativo;

    public static BeneficioResponse fromEntity(CadastroBeneficios beneficio) {
        BeneficioResponse response = new BeneficioResponse();
        response.setId(beneficio.getId());
        response.setNomeBeneficio(beneficio.getNomeBeneficio());
        response.setDescricao(beneficio.getDescricao());
        response.setAtivo(beneficio.isAtivo());
        return response;
    }
}
