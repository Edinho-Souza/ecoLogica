package br.com.ecologica.controller;

import br.com.ecologica.dto.CampanhaRequest;
import br.com.ecologica.dto.CampanhaResponse;
import br.com.ecologica.service.CadastroCampanhasService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/campanhas")
public class CadastroCampanhasController {

    @Autowired
    private CadastroCampanhasService service;

    @GetMapping("/ativas") 
    public ResponseEntity<List<CampanhaResponse>> listarCampanhasAtivas() {
        List<CampanhaResponse> lista = service.listarCampanhasAtivas().stream()
                .map(CampanhaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping
    public ResponseEntity<List<CampanhaResponse>> listarTodasCampanhas() {
        List<CampanhaResponse> lista = service.listarTodas().stream()
                .map(CampanhaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampanhaResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(CampanhaResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CampanhaResponse> criar(@Valid @RequestBody CampanhaRequest request) {
        var campanhaSalva = service.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CampanhaResponse.fromEntity(campanhaSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampanhaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody CampanhaRequest request) {
        var campanhaAtualizada = service.atualizar(id, request);
        return ResponseEntity.ok(CampanhaResponse.fromEntity(campanhaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}