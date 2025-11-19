package br.com.ecologica.controller;

import br.com.ecologica.dto.RankingRequest;
import br.com.ecologica.dto.RankingResponse;
import br.com.ecologica.service.ExibicaoRankingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ranking")
public class ExibicaoRankingController {

    @Autowired
    private ExibicaoRankingService service;

    @GetMapping
    public ResponseEntity<List<RankingResponse>> listarRanking() {
        List<RankingResponse> lista = service.listarRanking()
                .stream()
                .map(RankingResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RankingResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(RankingResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RankingResponse> criar(@Valid @RequestBody RankingRequest request) {
        var salvo = service.salvar(request); 
        return ResponseEntity.ok(RankingResponse.fromEntity(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}