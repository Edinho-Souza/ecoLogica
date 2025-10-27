package br.com.ecologica.cadastro.tipomateriais.dto;

import lombok.Data;

@Data
public class TipoMaterialDto {
    private Long id;
    private String nomeTipo;
    private String descricao;
    private boolean ativo;
}