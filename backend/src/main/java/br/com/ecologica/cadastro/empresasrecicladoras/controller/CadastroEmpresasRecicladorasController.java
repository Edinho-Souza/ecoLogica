package br.com.ecologica.cadastro.empresasrecicladoras.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.empresasrecicladoras.service.CadastroEmpresasRecicladorasService;

import java.util.List;

@RestController
@RequestMapping("/api/empresas-recicladoras")
public class CadastroEmpresasRecicladorasController {

    @Autowired
    private CadastroEmpresasRecicladorasService service;

    @GetMapping
    public List<CadastroEmpresasRecicladoras> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public CadastroEmpresasRecicladoras buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id).orElse(null);
    }

    @PostMapping
    public CadastroEmpresasRecicladoras criar(@RequestBody CadastroEmpresasRecicladoras empresa) {
        return service.salvar(empresa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}