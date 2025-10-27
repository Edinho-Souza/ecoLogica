package br.com.ecologica.cadastro.beneficios.dto;

import lombok.Data;

@Data
public class BeneficioDto {

    private Long id;
    private String nomeBeneficio;
    private String descricao;
    private boolean ativo;
}
