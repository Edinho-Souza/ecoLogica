package br.com.ecologica.cadastro.locaiscoleta.controller;

import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaRequest;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaResponse;
import br.com.ecologica.cadastro.locaiscoleta.service.CadastroLocaisColetaService;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.login.security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locais-coleta")
public class CadastroLocaisColetaController {
	@Autowired
	private CadastroLocaisColetaService service;

	@GetMapping
	public ResponseEntity<List<LocalColetaResponse>> listarTodos() {
		List<LocalColetaResponse> lista = service.listarTodos().stream().map(LocalColetaResponse::fromEntity)
				.collect(Collectors.toList());
		return ResponseEntity.ok(lista);
	}

	@GetMapping("/{id}")
	public ResponseEntity<LocalColetaResponse> buscarPorId(@PathVariable Long id) {
		return service.buscarPorId(id).map(LocalColetaResponse::fromEntity).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<LocalColetaResponse> criar(@Valid @RequestBody LocalColetaRequest request,
			Authentication authentication) {
		// Pega o usuário logado
		Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
		CadastroLocaisColeta salvo = service.salvar(request, usuario);
		LocalColetaResponse response = LocalColetaResponse.fromEntity(salvo);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<LocalColetaResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody LocalColetaRequest request, Authentication authentication) {
		// Pega o usuário logado
		Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
		return service.atualizar(id, request, usuario).map(LocalColetaResponse::fromEntity).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication authentication) {
		Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
		service.deletar(id, usuario);
		return ResponseEntity.noContent().build();
	}
}