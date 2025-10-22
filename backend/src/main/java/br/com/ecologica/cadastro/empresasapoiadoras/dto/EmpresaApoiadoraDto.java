package br.com.ecologica.cadastro.empresasapoiadoras.dto;

import lombok.Data;

@Data
public class EmpresaApoiadoraDto {

    private Long id;
    private String nomeEmpresa;
    private String cnpj;
    private String contato;
    private boolean ativa;
}