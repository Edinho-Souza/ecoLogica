package br.com.ecologica.cadastro.empresasapoiadoras.controller;

import br.com.ecologica.cadastro.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastro.empresasapoiadoras.dto.EmpresaApoiadoraRequest;
import br.com.ecologica.cadastro.empresasapoiadoras.dto.EmpresaApoiadoraResponse;
import br.com.ecologica.cadastro.empresasapoiadoras.service.CadastroEmpresasApoiadorasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas-apoiadoras")
public class CadastroEmpresasApoiadorasController {

    @Autowired
    private CadastroEmpresasApoiadorasService service;

   
    @GetMapping
    public List<EmpresaApoiadoraResponse> listarTodas() {
        return service.listarTodas().stream()
                .map(EmpresaApoiadoraResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/aprovadas")
    public List<EmpresaApoiadoraResponse> listarAprovadas() {
        return service.listarTodas().stream()
                .filter(CadastroEmpresasApoiadoras::isAprovada)
                .map(EmpresaApoiadoraResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public EmpresaApoiadoraResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(EmpresaApoiadoraResponse::fromEntity)
                .orElse(null);
    }

    @PostMapping
    public EmpresaApoiadoraResponse criar(@RequestBody EmpresaApoiadoraRequest request) {
        CadastroEmpresasApoiadoras empresa = new CadastroEmpresasApoiadoras();
        empresa.setNomeEmpresa(request.getNomeEmpresa());
        empresa.setCnpj(request.getCnpj());
        empresa.setContato(request.getContato());
        empresa.setAtiva(request.isAtiva());
        empresa.setAprovada(request.isAprovada());
        return EmpresaApoiadoraResponse.fromEntity(service.salvar(empresa));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}