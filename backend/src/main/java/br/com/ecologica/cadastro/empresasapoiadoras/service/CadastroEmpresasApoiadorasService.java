package br.com.ecologica.cadastro.empresasapoiadoras.service;

import br.com.ecologica.cadastro.CadastroEmpresasApoiadoras;
import br.com.ecologica.cadastro.empresasapoiadoras.repository.CadastroEmpresasApoiadorasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroEmpresasApoiadorasService {

    @Autowired
    private CadastroEmpresasApoiadorasRepository repository;

    public CadastroEmpresasApoiadoras salvar(CadastroEmpresasApoiadoras empresa) {
        return repository.save(empresa);
    }

    public List<CadastroEmpresasApoiadoras> listarTodas() {
        return repository.findAll();
    }

    public Optional<CadastroEmpresasApoiadoras> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<CadastroEmpresasApoiadoras> listarAprovadas() {
        return repository.findByAprovadaTrue();
    }
}