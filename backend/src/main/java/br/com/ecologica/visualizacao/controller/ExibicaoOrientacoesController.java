package br.com.ecologica.visualizacao.controller;

import br.com.ecologica.visualizacao.ExibicaoOrientacoes;
import br.com.ecologica.visualizacao.dto.OrientacaoResponse;
import br.com.ecologica.visualizacao.service.ExibicaoOrientacoesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orientacoes")
public class ExibicaoOrientacoesController {

    @Autowired
    private ExibicaoOrientacoesService service;

    @GetMapping
    public ResponseEntity<List<OrientacaoResponse>> listarTodas() {
        List<OrientacaoResponse> lista = service.listarTodas()
                .stream()
                .map(OrientacaoResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<OrientacaoResponse>> listarAtivas() {
        List<OrientacaoResponse> lista = service.listarAtivas()
                .stream()
                .map(OrientacaoResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrientacaoResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(OrientacaoResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrientacaoResponse> criar(@Valid @RequestBody ExibicaoOrientacoes orientacao) {
        ExibicaoOrientacoes salvo = service.salvar(orientacao);
        return ResponseEntity.ok(OrientacaoResponse.fromEntity(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}