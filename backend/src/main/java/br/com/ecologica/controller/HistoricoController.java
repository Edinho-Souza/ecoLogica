package br.com.ecologica.controller;

import br.com.ecologica.dto.HistoricoResponse;
import br.com.ecologica.service.HistoricoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    @Autowired
    private HistoricoService service;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<HistoricoResponse>> exibirHistorico(@PathVariable Long usuarioId) {
        List<HistoricoResponse> historico = service.obterHistorico(usuarioId);
        return ResponseEntity.ok(historico);
    }
}