package br.com.ecologica.cadastro.tipomateriais.controller;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMateriaisRequest;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMaterialDto;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMaterialResponse;
import br.com.ecologica.cadastro.tipomateriais.service.TipoMaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tipos-materiais")
public class CadastroTipoMateriaisController {

	@Autowired
	private TipoMaterialService service;

	@GetMapping
	public List<TipoMaterialDto> listarTodos() {
		return service.listarTodos();
	}

	@GetMapping("/{id}")
	public ResponseEntity<TipoMaterialDto> buscarPorId(@PathVariable Long id) {
	    return service.buscarPorId(id)
	        .map(ResponseEntity::ok)
	        .orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public TipoMaterialDto salvar(@RequestBody CadastroTipoMateriais tipo) {
		return service.criar(tipo);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		service.deletar(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<TipoMaterialResponse> atualizar(@PathVariable Long id,
	        @Valid @RequestBody TipoMateriaisRequest request) {

	    Optional<TipoMaterialDto> existente = service.buscarPorId(id); 
	    if (existente.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }

	    TipoMaterialDto tipo = existente.get();
	    tipo.setNomeTipo(request.getNomeTipo());
	    tipo.setDescricao(request.getDescricao());
	    tipo.setAtivo(request.isAtivo());

	    TipoMaterialDto atualizado = service.atualizar(id, tipo);
	    TipoMaterialResponse response = service.converterParaResponse(atualizado);
	    return ResponseEntity.ok(response);
	}
}