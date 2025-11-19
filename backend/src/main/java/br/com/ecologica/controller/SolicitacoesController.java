package br.com.ecologica.controller;

import br.com.ecologica.dto.SolicitacaoRequest;
import br.com.ecologica.dto.SolicitacaoResponse;
import br.com.ecologica.service.SolicitacoesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacoesController {

    @Autowired
    private SolicitacoesService service;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarSolicitacoes(@PathVariable Long usuarioId) {
        List<SolicitacaoResponse> lista = service.obterSolicitacoes(usuarioId);
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request) {
        var solicitacaoSalva = service.criarSolicitacao(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SolicitacaoResponse.fromEntity(solicitacaoSalva));
    }
}