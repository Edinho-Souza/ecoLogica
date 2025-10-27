package br.com.ecologica.cadastro.empresasrecicladoras.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.empresasrecicladoras.repository.CadastroEmpresasRecicladorasRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroEmpresasRecicladorasService {

    @Autowired
    private CadastroEmpresasRecicladorasRepository repository;

    public CadastroEmpresasRecicladoras salvar(CadastroEmpresasRecicladoras empresa) {
        return repository.save(empresa);
    }

    public List<CadastroEmpresasRecicladoras> listarTodas() {
        return repository.findAll();
    }

    public Optional<CadastroEmpresasRecicladoras> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}