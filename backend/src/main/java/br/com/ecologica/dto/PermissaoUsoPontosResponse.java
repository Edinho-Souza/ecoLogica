package br.com.ecologica.dto;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import lombok.Data;

@Data
public class PermissaoUsoPontosResponse {
	private Long id;
	private Long usuarioId;
	private String nomeUsuario;
	private boolean permitido;
	private String motivo;

	public static PermissaoUsoPontosResponse fromEntity(PermissaoUsoPontos permissao) {
		PermissaoUsoPontosResponse response = new PermissaoUsoPontosResponse();
		response.setId(permissao.getId());
		response.setPermitido(permissao.isPermitido());
		response.setMotivo(permissao.getMotivo());

		if (permissao.getUsuario() != null) {
			response.setUsuarioId(permissao.getUsuario().getId());
			response.setNomeUsuario(permissao.getUsuario().getNome());
		}

		return response;
	}
}