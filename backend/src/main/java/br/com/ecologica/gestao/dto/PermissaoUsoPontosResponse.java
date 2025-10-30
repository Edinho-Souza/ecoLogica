package br.com.ecologica.gestao.dto;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import lombok.Data;

@Data
public class PermissaoUsoPontosResponse {
    private Long id;
    private Long usuarioId;
    private boolean permitido;
    private String motivo;

    public static PermissaoUsoPontosResponse fromEntity(PermissaoUsoPontos permissao) {
        PermissaoUsoPontosResponse response = new PermissaoUsoPontosResponse();
        response.setId(permissao.getId());
        response.setUsuarioId(permissao.getUsuarioId());
        response.setPermitido(permissao.isPermitido());
        response.setMotivo(permissao.getMotivo());
        return response;
    }
}