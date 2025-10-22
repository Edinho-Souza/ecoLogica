package br.com.ecologica.cadastro.locaiscoleta.dto;

import lombok.Data;

@Data
public class LocalColetaDto {

    private Long id;
    private String nomeLocal;
    private String endereco;
    private String cidade;
    private String estado;
    private String horarioFuncionamento;
    private boolean ativo;
}