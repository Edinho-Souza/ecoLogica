package br.com.ecologica.cadastro.empresasrecicladoras.dto;

import lombok.Data;

@Data
public class EmpresaRecicladoraDto {

    private Long id;
    private String nomeEmpresa;
    private String cidade;
    private String tipoMaterial;
    private boolean ativa;
}