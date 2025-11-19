package br.com.ecologica.controller;

import br.com.ecologica.dto.EmpresaRecicladoraResponse;
import br.com.ecologica.service.CadastroEmpresasRecicladorasService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas-recicladoras")
public class CadastroEmpresasRecicladorasController {

    @Autowired
    private CadastroEmpresasRecicladorasService service;

    @GetMapping
    public ResponseEntity<List<EmpresaRecicladoraResponse>> listarTodas() {
        List<EmpresaRecicladoraResponse> lista = service.listarTodas()
                .stream()
                .map(EmpresaRecicladoraResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaRecicladoraResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(EmpresaRecicladoraResponse::fromEntity) 
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}