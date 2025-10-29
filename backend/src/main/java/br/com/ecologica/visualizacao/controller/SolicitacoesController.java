package br.com.ecologica.visualizacao.controller;

import br.com.ecologica.visualizacao.dto.SolicitacaoResponse;
import br.com.ecologica.visualizacao.service.SolicitacoesService;
import org.springframework.beans.factory.annotation.Autowired;
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
}