package br.com.ecologica.pontuacao.controller;

import br.com.ecologica.pontuacao.dto.PontuacaoResponse;
import br.com.ecologica.pontuacao.service.PontuacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pontuacao")
public class PontuacaoController {

    @Autowired
    private PontuacaoService service;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PontuacaoResponse> acompanharPontuacao(@PathVariable Long usuarioId) {
        PontuacaoResponse response = service.obterPontuacao(usuarioId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/usuario/{usuarioId}/historico")
    public ResponseEntity<List<PontuacaoResponse>> historicoPontuacao(@PathVariable Long usuarioId) {
        List<PontuacaoResponse> historico = service.obterHistorico(usuarioId);
        return ResponseEntity.ok(historico);
    }
}