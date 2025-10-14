package br.com.ecologica.cadastro.materiais.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.ecologica.cadastro.CadastroMateriaisColetar;
import br.com.ecologica.cadastro.materiais.repository.CadastroMateriaisColetarRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CadastroMateriaisColetarService {

    @Autowired
    private CadastroMateriaisColetarRepository repository;

    public CadastroMateriaisColetar salvar(CadastroMateriaisColetar material) {
        return repository.save(material);
    }

    public List<CadastroMateriaisColetar> listarTodos() {
        return repository.findAll();
    }

    public Optional<CadastroMateriaisColetar> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}