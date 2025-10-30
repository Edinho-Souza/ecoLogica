package br.com.ecologica.gestao.controller;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import br.com.ecologica.gestao.dto.PermissaoUsoPontosRequest;
import br.com.ecologica.gestao.dto.PermissaoUsoPontosResponse;
import br.com.ecologica.gestao.service.PermissaoUsoPontosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
        List<PermissaoUsoPontosResponse> lista = service.buscarPorUsuario(usuarioId)
                .stream()
                .map(PermissaoUsoPontosResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<PermissaoUsoPontosResponse> criar(@Valid @RequestBody PermissaoUsoPontosRequest request) {
        PermissaoUsoPontos permissao = new PermissaoUsoPontos();
        permissao.setUsuarioId(request.getUsuarioId());
        permissao.setPermitido(request.isPermitido());
        permissao.setMotivo(request.getMotivo());

        PermissaoUsoPontos salvo = service.salvar(permissao);
        return ResponseEntity.ok(PermissaoUsoPontosResponse.fromEntity(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
