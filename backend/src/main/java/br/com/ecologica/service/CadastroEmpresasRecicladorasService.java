package br.com.ecologica.service;

import br.com.ecologica.CadastroEmpresasRecicladoras;
import br.com.ecologica.repository.CadastroEmpresasRecicladorasRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroEmpresasRecicladorasService {

    @Autowired
    private CadastroEmpresasRecicladorasRepository repository;

    public List<CadastroEmpresasRecicladoras> listarTodas() {
        return repository.findAll();
    }

    public Optional<CadastroEmpresasRecicladoras> buscarPorId(Long id) {
        return repository.findById(id);
    }
}