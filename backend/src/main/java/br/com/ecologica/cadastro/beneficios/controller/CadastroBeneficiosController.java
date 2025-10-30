package br.com.ecologica.cadastro.beneficios.controller;

import br.com.ecologica.cadastro.beneficios.dto.BeneficioResponse;

import br.com.ecologica.cadastro.beneficios.service.CadastroBeneficiosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/beneficios")
public class CadastroBeneficiosController {

    @Autowired
    private CadastroBeneficiosService service;

    @GetMapping
    public ResponseEntity<List<BeneficioResponse>> listarTodos() {
        return ResponseEntity.ok(
            service.listarTodos()
                .stream()
                .map(BeneficioResponse::fromEntity)
                .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeneficioResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(BeneficioResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
  }
}

