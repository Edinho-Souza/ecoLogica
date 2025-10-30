package br.com.ecologica.visualizacao.service;

import br.com.ecologica.visualizacao.ExibicaoOrientacoes;
import br.com.ecologica.visualizacao.repository.ExibicaoOrientacoesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExibicaoOrientacoesService {

    @Autowired
    private ExibicaoOrientacoesRepository repository;

    public List<ExibicaoOrientacoes> listarTodas() {
        return repository.findAll();
    }

    public List<ExibicaoOrientacoes> listarAtivas() {
        return repository.findByAtivoTrue();
    }

    public Optional<ExibicaoOrientacoes> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public ExibicaoOrientacoes salvar(ExibicaoOrientacoes orientacao) {
        return repository.save(orientacao);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}