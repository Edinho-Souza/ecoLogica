package br.com.ecologica.cadastro.tipomateriais.controller;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import br.com.ecologica.cadastro.tipomateriais.service.CadastroTipoMateriaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-materiais")
public class CadastroTipoMateriaisController {

    @Autowired
    private CadastroTipoMateriaisService service;

    @GetMapping
    public List<CadastroTipoMateriais> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CadastroTipoMateriais> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CadastroTipoMateriais salvar(@RequestBody CadastroTipoMateriais tipo) {
        return service.salvar(tipo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}