package br.com.ecologica.controller;

import br.com.ecologica.dto.EmpresaApoiadoraRequest;
import br.com.ecologica.dto.EmpresaApoiadoraResponse;
import br.com.ecologica.service.CadastroEmpresasApoiadorasService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas-apoiadoras")
public class CadastroEmpresasApoiadorasController {

    @Autowired
    private CadastroEmpresasApoiadorasService service;

    @GetMapping
    public List<EmpresaApoiadoraResponse> listarTodas() {
        return service.listarTodas().stream()
                .map(EmpresaApoiadoraResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/aprovadas") 
    public List<EmpresaApoiadoraResponse> listarAprovadas() {
        return service.listarAprovadas().stream()
                .map(EmpresaApoiadoraResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaApoiadoraResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(EmpresaApoiadoraResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaApoiadoraResponse> atualizarDetalhes(@PathVariable Long id, @RequestBody EmpresaApoiadoraRequest request) {
        return service.atualizarDetalhes(id, request)
                .map(EmpresaApoiadoraResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id); 
        return ResponseEntity.noContent().build();
    }
}