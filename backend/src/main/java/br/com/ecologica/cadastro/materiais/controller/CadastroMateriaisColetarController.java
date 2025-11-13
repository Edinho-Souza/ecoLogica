package br.com.ecologica.cadastro.materiais.controller;

import br.com.ecologica.cadastro.CadastroMateriaisColetar;
import br.com.ecologica.cadastro.materiais.dto.MaterialRequest;
import br.com.ecologica.cadastro.materiais.dto.MaterialResponse;
import br.com.ecologica.cadastro.materiais.service.CadastroMateriaisColetarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/materiais")
public class CadastroMateriaisColetarController {

    @Autowired
    private CadastroMateriaisColetarService service;

    @PostMapping
    public ResponseEntity<MaterialResponse> criar(@Valid @RequestBody MaterialRequest request) {
        try {
            CadastroMateriaisColetar salvo = service.salvar(request);
            MaterialResponse response = MaterialResponse.fromEntity(salvo);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            // Retorna 404 se o Tipo de Material ou Local de Coleta não forem encontrados
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
        }
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponse>> listarTodos() {
        List<MaterialResponse> lista = service.listarTodos()
                .stream()
                .map(MaterialResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(MaterialResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}