package br.com.ecologica.controller;

import br.com.ecologica.dto.EstatisticaRequest;
import br.com.ecologica.dto.EstatisticaResponse;
import br.com.ecologica.service.EstatisticasService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/estatisticas")
public class EstatisticasController {

    @Autowired
    private EstatisticasService service;

    @GetMapping
    public ResponseEntity<List<EstatisticaResponse>> listarTodas() {
        List<EstatisticaResponse> lista = service.listarTodas().stream()
                .map(EstatisticaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<EstatisticaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<EstatisticaResponse> lista = service.listarPorUsuario(usuarioId).stream()
                .map(EstatisticaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<EstatisticaResponse> criar(@Valid @RequestBody EstatisticaRequest request) {
        var salvo = service.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(EstatisticaResponse.fromEntity(salvo));
    }
}