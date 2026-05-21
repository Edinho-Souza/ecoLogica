package br.com.ecologica.controller;

import br.com.ecologica.cadastros.CadastroBeneficios;
import br.com.ecologica.dto.BeneficioRequest;
import br.com.ecologica.dto.BeneficioResponse;
import br.com.ecologica.service.CadastroBeneficiosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/beneficios")
public class CadastroBeneficiosController {

	@Autowired
	private CadastroBeneficiosService service;

	@GetMapping
	public ResponseEntity<List<BeneficioResponse>> listarTodos() {
		List<BeneficioResponse> lista = service.listarTodos().stream().map(BeneficioResponse::fromEntity)
				.collect(Collectors.toList());
		return ResponseEntity.ok(lista);
	}

	@GetMapping("/{id}")
	public ResponseEntity<BeneficioResponse> buscarPorId(@PathVariable Long id) {
		return service.buscarPorId(id).map(BeneficioResponse::fromEntity).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<BeneficioResponse> criar(@Valid @RequestBody BeneficioRequest request) {
		CadastroBeneficios novoBeneficio = new CadastroBeneficios();
		novoBeneficio.setTitulo(request.getTitulo());
		novoBeneficio.setDescricao(request.getDescricao());
		novoBeneficio.setPontosNecessarios(request.getPontosNecessarios());
		novoBeneficio.setImagemUrl(request.getImagemUrl());
		novoBeneficio.setEstoque(request.getEstoque());

		CadastroBeneficios beneficioSalvo = service.salvar(novoBeneficio);

		return ResponseEntity.status(HttpStatus.CREATED).body(BeneficioResponse.fromEntity(beneficioSalvo));
	}

	@PutMapping("/{id}")
	public ResponseEntity<BeneficioResponse> atualizar(@PathVariable Long id,
			@Valid @RequestBody BeneficioRequest request) {
		return service.buscarPorId(id).map(beneficioExistente -> {
			beneficioExistente.setTitulo(request.getTitulo());
			beneficioExistente.setDescricao(request.getDescricao());
			beneficioExistente.setPontosNecessarios(request.getPontosNecessarios());
			beneficioExistente.setImagemUrl(request.getImagemUrl());
			beneficioExistente.setEstoque(request.getEstoque());

			CadastroBeneficios beneficioAtualizado = service.salvar(beneficioExistente);

			return ResponseEntity.ok(BeneficioResponse.fromEntity(beneficioAtualizado));
		})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		if (service.buscarPorId(id).isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		service.deletar(id);
		return ResponseEntity.noContent().build();
	}
}
