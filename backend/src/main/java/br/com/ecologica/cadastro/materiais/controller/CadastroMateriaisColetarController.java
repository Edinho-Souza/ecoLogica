package br.com.ecologica.cadastro.materiais.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.ecologica.cadastro.CadastroMateriaisColetar;
import br.com.ecologica.cadastro.materiais.service.CadastroMateriaisColetarService;

import java.util.List;

@RestController
@RequestMapping("/api/materiais")
public class CadastroMateriaisColetarController {

    @Autowired
    private CadastroMateriaisColetarService service;

    @GetMapping
    public List<CadastroMateriaisColetar> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public CadastroMateriaisColetar buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id).orElse(null);
    }

    @PostMapping
    public CadastroMateriaisColetar criar(@RequestBody CadastroMateriaisColetar material) {
        return service.salvar(material);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}