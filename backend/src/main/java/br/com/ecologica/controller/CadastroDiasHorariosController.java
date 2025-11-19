package br.com.ecologica.controller;

import br.com.ecologica.CadastroDiasHorarios;
import br.com.ecologica.dto.DiasHorariosRequest;
import br.com.ecologica.dto.DiasHorariosResponse;
import br.com.ecologica.login.security.CustomUserDetails;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.service.CadastroDiasHorariosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dias-horarios")
public class CadastroDiasHorariosController {
	@Autowired
	private CadastroDiasHorariosService service;

	@GetMapping
	public ResponseEntity<List<DiasHorariosResponse>> listarTodos() {
		List<DiasHorariosResponse> lista = service.listarTodos().stream().map(DiasHorariosResponse::fromEntity)
				.collect(Collectors.toList());
		return ResponseEntity.ok(lista);
	}

	@GetMapping("/{id}")
	public ResponseEntity<DiasHorariosResponse> buscarPorId(@PathVariable Long id) {
		return service.buscarPorId(id).map(DiasHorariosResponse::fromEntity).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<DiasHorariosResponse> criar(@Valid @RequestBody DiasHorariosRequest request,
			Authentication authentication) {
		// Pega o usuário logado
		Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
		try {
			CadastroDiasHorarios salvo = service.salvar(request, usuario);
			DiasHorariosResponse response = DiasHorariosResponse.fromEntity(salvo);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (AccessDeniedException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<DiasHorariosResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody DiasHorariosRequest request, Authentication authentication) {
		Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
		try {
			return service.atualizar(id, request, usuario).map(DiasHorariosResponse::fromEntity).map(ResponseEntity::ok)
					.orElse(ResponseEntity.notFound().build());
		} catch (AccessDeniedException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication authentication) {
		Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
		try {
			service.deletar(id, usuario);
			return ResponseEntity.noContent().build();
		} catch (AccessDeniedException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}
}