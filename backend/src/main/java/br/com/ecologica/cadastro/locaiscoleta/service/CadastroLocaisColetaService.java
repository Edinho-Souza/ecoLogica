package br.com.ecologica.cadastro.locaiscoleta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.ecologica.cadastro.CadastroLocaisColeta;
import br.com.ecologica.cadastro.locaiscoleta.repository.CadastroLocaisColetaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroLocaisColetaService {

    @Autowired
    private CadastroLocaisColetaRepository repository;

    public CadastroLocaisColeta salvar(CadastroLocaisColeta local) {
        return repository.save(local);
    }

    public List<CadastroLocaisColeta> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroLocaisColeta> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}