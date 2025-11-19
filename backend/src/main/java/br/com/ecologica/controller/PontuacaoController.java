package br.com.ecologica.controller;

import br.com.ecologica.dto.PontuacaoRequest;
import br.com.ecologica.dto.PontuacaoResponse;
import br.com.ecologica.dto.RankingResponse;
import br.com.ecologica.dto.ResgateBeneficioRequest;
import br.com.ecologica.service.PontuacaoService;
import br.com.ecologica.visualizacao.ExibicaoRanking;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pontuacao")
public class PontuacaoController {

    @Autowired
    private PontuacaoService service;

    @PostMapping("/atribuir")
    public ResponseEntity<RankingResponse> atribuirPontos(@Valid @RequestBody PontuacaoRequest request) {
        try {
            ExibicaoRanking rankingAtualizado = service.atribuirPontos(request);
            return ResponseEntity.ok(RankingResponse.fromEntity(rankingAtualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PontuacaoResponse> acompanharPontuacao(@PathVariable Long usuarioId) {
        PontuacaoResponse response = service.obterPontuacao(usuarioId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resgatar")
    public ResponseEntity<?> resgatarBeneficio(@Valid @RequestBody ResgateBeneficioRequest request) {
        try {
            ExibicaoRanking rankingAtualizado = service.resgatarBeneficio(request);
            return ResponseEntity.ok(RankingResponse.fromEntity(rankingAtualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}