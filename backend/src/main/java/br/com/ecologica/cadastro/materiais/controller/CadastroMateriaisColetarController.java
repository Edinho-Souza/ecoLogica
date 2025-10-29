package br.com.ecologica.cadastro.materiais.controller;

import br.com.ecologica.cadastro.CadastroMateriaisColetar;
import br.com.ecologica.cadastro.materiais.dto.MaterialRequest;
import br.com.ecologica.cadastro.materiais.dto.MaterialResponse;
import br.com.ecologica.cadastro.materiais.service.CadastroMateriaisColetarService;
import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.CadastroLocaisColeta;
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
        CadastroMateriaisColetar material = new CadastroMateriaisColetar();
        material.setNomeMaterial(request.getNomeMaterial());
        material.setDescricao(request.getDescricao());
        material.setReciclavel(request.isReciclavel());

        // Associação com TipoMaterial
        if (request.getTipoMaterial() != null) {
            CadastroTipoMateriais tipo = new CadastroTipoMateriais();
            tipo.setNomeTipo(request.getTipoMaterial());
            material.setTipoMaterial(tipo);
        }

        // Associação com Local de Coleta
        if (request.getLocalColetaId() != null) {
            CadastroLocaisColeta local = new CadastroLocaisColeta();
            local.setId(request.getLocalColetaId());
            material.setLocalColeta(local);
        }

        CadastroMateriaisColetar salvo = service.salvar(material);
        MaterialResponse response = MaterialResponse.fromEntity(salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
