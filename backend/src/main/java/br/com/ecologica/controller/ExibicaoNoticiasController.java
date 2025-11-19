package br.com.ecologica.controller;

import br.com.ecologica.dto.NoticiaRequest;
import br.com.ecologica.dto.NoticiaResponse;
import br.com.ecologica.service.ExibicaoNoticiasService;
import br.com.ecologica.visualizacao.ExibicaoNoticias;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/noticias")
public class ExibicaoNoticiasController {

    @Autowired
    private ExibicaoNoticiasService service;

    @GetMapping
    public ResponseEntity<List<NoticiaResponse>> listarTodas() {
        List<NoticiaResponse> lista = service.listarTodas().stream()
                .map(NoticiaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }


    @GetMapping("/{id}")
    public ResponseEntity<NoticiaResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(NoticiaResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NoticiaResponse> criar(@Valid @RequestBody NoticiaRequest request) {
        ExibicaoNoticias salvo = service.salvar(request);
        return ResponseEntity.ok(NoticiaResponse.fromEntity(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}