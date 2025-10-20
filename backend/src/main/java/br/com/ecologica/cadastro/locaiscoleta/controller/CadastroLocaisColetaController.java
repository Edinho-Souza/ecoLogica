package br.com.ecologica.cadastro.locaiscoleta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.locaiscoleta.service.CadastroLocaisColetaService;

import java.util.List;

@RestController
@RequestMapping("/api/locais-coleta")
public class CadastroLocaisColetaController {

    @Autowired
    private CadastroLocaisColetaService service;

    @GetMapping
    public List<CadastroLocaisColeta> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public CadastroLocaisColeta buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id).orElse(null);
    }

    @PostMapping
    public CadastroLocaisColeta criar(@RequestBody CadastroLocaisColeta local) {
        return service.salvar(local);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}