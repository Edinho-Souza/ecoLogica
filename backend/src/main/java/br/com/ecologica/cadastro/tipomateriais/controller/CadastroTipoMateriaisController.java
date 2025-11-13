package br.com.ecologica.cadastro.tipomateriais.controller;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMateriaisRequest;
import br.com.ecologica.cadastro.tipomateriais.dto.TipoMaterialResponse; 
import br.com.ecologica.cadastro.tipomateriais.service.TipoMaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors; 

@RestController
@RequestMapping("/api/tipos-materiais")
public class CadastroTipoMateriaisController {

    @Autowired
    private TipoMaterialService service;

    // Retorna TipoMaterialResponse para consistência
    @GetMapping
    public ResponseEntity<List<TipoMaterialResponse>> listarTodos() {
        List<TipoMaterialResponse> responseList = service.listarTodos().stream()
                .map(TipoMaterialResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // Retorna TipoMaterialResponse para consistência
    @GetMapping("/{id}")
    public ResponseEntity<TipoMaterialResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(TipoMaterialResponse::fromEntity) // Converte para Response
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipoMaterialResponse> criar(@Valid @RequestBody TipoMateriaisRequest request) {
        // Chama o serviço com o Request
        CadastroTipoMateriais salvo = service.criar(request);
        TipoMaterialResponse response = TipoMaterialResponse.fromEntity(salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoMaterialResponse> atualizar(@PathVariable Long id,
                                                        @Valid @RequestBody TipoMateriaisRequest request) {
        try {
            // Chama o serviço com o Request
            CadastroTipoMateriais atualizado = service.atualizar(id, request);
            TipoMaterialResponse response = TipoMaterialResponse.fromEntity(atualizado);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
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