package br.com.ecologica.gestao.controller;

import br.com.ecologica.gestao.GestaoConteudo;
import br.com.ecologica.gestao.dto.GestaoConteudoRequest;
import br.com.ecologica.gestao.dto.GestaoConteudoResponse;
import br.com.ecologica.gestao.service.GestaoConteudoService;
import org.springframework.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/conteudo")
public class GestaoConteudoController {

    @Autowired
    private GestaoConteudoService service;

    @GetMapping
    public ResponseEntity<List<GestaoConteudoResponse>> listarTodos() {
        List<GestaoConteudoResponse> lista = service.listarTodos()
                .stream()
                .map(GestaoConteudoResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GestaoConteudoResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(GestaoConteudoResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GestaoConteudoResponse> criar(@Valid @RequestBody GestaoConteudoRequest request) {
        GestaoConteudo conteudo = new GestaoConteudo();
        conteudo.setTipoConteudo(request.getTipoConteudo());
        conteudo.setTitulo(request.getTitulo());
        conteudo.setDescricao(request.getDescricao());
        conteudo.setPublicado(request.isPublicado());

        GestaoConteudo salvo = service.salvar(conteudo);
        return ResponseEntity.ok(GestaoConteudoResponse.fromEntity(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}