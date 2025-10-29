package br.com.ecologica.cadastro.locaiscoleta.controller;

import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaRequest;
import br.com.ecologica.cadastro.locaiscoleta.dto.LocalColetaResponse;
import br.com.ecologica.cadastro.locaiscoleta.service.CadastroLocaisColetaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locais-coleta")
public class CadastroLocaisColetaController {

    @Autowired
    private CadastroLocaisColetaService service;

    @GetMapping
    public ResponseEntity<List<LocalColetaResponse>> listarTodos() {
        List<LocalColetaResponse> lista = service.listarTodos()
                .stream()
                .map(LocalColetaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalColetaResponse> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(LocalColetaResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LocalColetaResponse> criar(@Valid @RequestBody LocalColetaRequest request) {
        CadastroLocaisColeta local = new CadastroLocaisColeta();
        local.setNomeLocal(request.getNomeLocal());
        local.setEndereco(request.getEndereco());
        local.setCidade(request.getCidade());
        local.setEstado(request.getEstado());
        local.setHorarioFuncionamento(request.getHorarioFuncionamento());
        local.setAtivo(request.isAtivo());

        CadastroLocaisColeta salvo = service.salvar(local);
        LocalColetaResponse response = LocalColetaResponse.fromEntity(salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocalColetaResponse> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody LocalColetaRequest request) {
        return service.buscarPorId(id)
                .map(local -> {
                    local.setNomeLocal(request.getNomeLocal());
                    local.setEndereco(request.getEndereco());
                    local.setCidade(request.getCidade());
                    local.setEstado(request.getEstado());
                    local.setHorarioFuncionamento(request.getHorarioFuncionamento());
                    local.setAtivo(request.isAtivo());
                    CadastroLocaisColeta atualizado = service.salvar(local);
                    return ResponseEntity.ok(LocalColetaResponse.fromEntity(atualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}