package br.com.ecologica.controller;

import br.com.ecologica.cadastros.CadastroLocaisColeta;
import br.com.ecologica.dto.LocalColetaRequest;
import br.com.ecologica.dto.LocalColetaResponse;
import br.com.ecologica.login.security.CustomUserDetails;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.service.CadastroLocaisColetaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locais-coleta")
public class CadastroLocaisColetaController {

    @Autowired
    private CadastroLocaisColetaService service;

    // Endpoints GET, POST, PUT, DELETE
    @GetMapping
    public ResponseEntity<List<LocalColetaResponse>> listarTodos() {
        List<LocalColetaResponse> lista = service.listarTodos().stream().map(LocalColetaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalColetaResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id).map(LocalColetaResponse::fromEntity).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LocalColetaResponse> criar(@Valid @RequestBody LocalColetaRequest request,
            Authentication authentication) {
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        CadastroLocaisColeta salvo = service.salvar(request, usuario);
        LocalColetaResponse response = LocalColetaResponse.fromEntity(salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocalColetaResponse> atualizar(@PathVariable Long id,
            @Valid @RequestBody LocalColetaRequest request, Authentication authentication) {
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        return service.atualizar(id, request, usuario).map(LocalColetaResponse::fromEntity).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        service.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para adicionar um material a um local
    @PostMapping("/{localId}/materiais/{tipoMaterialId}")
    public ResponseEntity<LocalColetaResponse> adicionarMaterial(
            @PathVariable Long localId,
            @PathVariable Long tipoMaterialId,
            Authentication authentication) {
        
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        try {
            CadastroLocaisColeta atualizado = service.adicionarMaterial(localId, tipoMaterialId, usuario);
            return ResponseEntity.ok(LocalColetaResponse.fromEntity(atualizado));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para remover um material de um local
    @DeleteMapping("/{localId}/materiais/{tipoMaterialId}")
    public ResponseEntity<Void> removerMaterial(
            @PathVariable Long localId,
            @PathVariable Long tipoMaterialId,
            Authentication authentication) {
        
        Usuario usuario = ((CustomUserDetails) authentication.getPrincipal()).getUsuario();
        try {
            service.removerMaterial(localId, tipoMaterialId, usuario);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}