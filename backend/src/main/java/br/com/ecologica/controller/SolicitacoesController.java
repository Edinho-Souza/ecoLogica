package br.com.ecologica.controller;

import br.com.ecologica.dto.SolicitacaoRequest;
import br.com.ecologica.dto.SolicitacaoResponse;
import br.com.ecologica.dto.SolicitacaoStatusRequest;
import br.com.ecologica.service.SolicitacoesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacoesController {

    private final SolicitacoesService service;

    public SolicitacoesController(SolicitacoesService service) {
        this.service = service;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.obterSolicitacoesUsuario(usuarioId));
    }

    @GetMapping("/recicladora/{recicladoraId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorRecicladora(@PathVariable Long recicladoraId) {
        return ResponseEntity.ok(service.obterSolicitacoesRecicladora(recicladoraId));
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request) {
        var solicitacaoSalva = service.criarSolicitacao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SolicitacaoResponse.fromEntity(solicitacaoSalva));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SolicitacaoResponse> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoStatusRequest request) {
        return ResponseEntity.ok(SolicitacaoResponse.fromEntity(service.atualizarStatus(id, request.getStatus())));
    }
}
