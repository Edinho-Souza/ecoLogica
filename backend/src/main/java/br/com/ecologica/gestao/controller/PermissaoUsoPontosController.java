package br.com.ecologica.gestao.controller;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import br.com.ecologica.gestao.dto.PermissaoUsoPontosRequest;
import br.com.ecologica.gestao.dto.PermissaoUsoPontosResponse;
import br.com.ecologica.gestao.service.PermissaoUsoPontosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/permissao-pontos")
public class PermissaoUsoPontosController {

    @Autowired
    private PermissaoUsoPontosService service;

    @GetMapping
    public ResponseEntity<List<PermissaoUsoPontosResponse>> listarTodos() {
        List<PermissaoUsoPontosResponse> lista = service.listarTodos()
                .stream()
                .map(PermissaoUsoPontosResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissaoUsoPontosResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(PermissaoUsoPontosResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PermissaoUsoPontosResponse>> buscarPorUsuario(@PathVariable Long usuarioId) {
        List<PermissaoUsoPontosResponse> lista = service.buscarPorUsuarioId(usuarioId)
                .stream()
                .map(PermissaoUsoPontosResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<PermissaoUsoPontosResponse> criar(@Valid @RequestBody PermissaoUsoPontosRequest request) {
        try {
            PermissaoUsoPontos salvo = service.salvar(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                           .body(PermissaoUsoPontosResponse.fromEntity(salvo));
        } catch (RuntimeException e) {
            // Retorna 404 se o usuário não for encontrado
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}