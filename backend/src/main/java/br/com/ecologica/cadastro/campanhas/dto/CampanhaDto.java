package br.com.ecologica.cadastro.campanhas.dto;

import lombok.Data;

@Data
public class CampanhaDto {

    private Long id;
    private String nomeCampanha;
    private String descricao;
    private boolean ativa;
}