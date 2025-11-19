package br.com.ecologica.service;

import br.com.ecologica.gestao.GestaoConteudo;
import br.com.ecologica.repository.GestaoConteudoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GestaoConteudoService {

    @Autowired
    private GestaoConteudoRepository repository;

    public GestaoConteudo salvar(GestaoConteudo conteudo) {
        return repository.save(conteudo);
    }

    public List<GestaoConteudo> listarTodos() {
        return repository.findAll();
    }

    public Optional<GestaoConteudo> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}