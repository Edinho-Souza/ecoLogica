package br.com.ecologica.controller;

import br.com.ecologica.dto.AvisoRequest;
import br.com.ecologica.dto.AvisoResponse;
import br.com.ecologica.service.GestaoConteudoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avisos")
public class AvisoController {

    private final GestaoConteudoService service;

    public AvisoController(GestaoConteudoService service) {
        this.service = service;
    }

    @GetMapping("/ativo")
    public ResponseEntity<AvisoResponse> buscarAtivo() {
        return service.buscarAvisoAtivo()
                .map(AvisoResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<AvisoResponse> publicar(@Valid @RequestBody AvisoRequest request) {
        var aviso = service.publicarAviso(request.getTexto(), request.getTipo());
        return ResponseEntity.status(HttpStatus.CREATED).body(AvisoResponse.fromEntity(aviso));
    }

    @DeleteMapping("/ativo")
    public ResponseEntity<Void> removerAtivo() {
        service.removerAvisosAtivos();
        return ResponseEntity.noContent().build();
    }
}
