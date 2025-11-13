package br.com.ecologica.cadastro.admin.controller;

import br.com.ecologica.cadastro.usuarios.dto.StatusUpdateRequest;
import br.com.ecologica.cadastro.usuarios.dto.UsuarioResponse;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
	@Autowired
	private UsuarioService usuarioService;

	@PutMapping("/usuarios/{id}/status")
	public ResponseEntity<UsuarioResponse> alterarStatusUsuario(@PathVariable Long id,
			@Valid @RequestBody StatusUpdateRequest request) {

		Usuario usuarioAtualizado = usuarioService.atualizarStatus(id, request.getStatus());
		UsuarioResponse response = usuarioService.converterParaResponse(usuarioAtualizado);
		return ResponseEntity.ok(response);
	}
}