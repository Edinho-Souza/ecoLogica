package br.com.ecologica.visualizacao.service;

import br.com.ecologica.visualizacao.ExibicaoNoticias;
import br.com.ecologica.visualizacao.repository.ExibicaoNoticiasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExibicaoNoticiasService {

    @Autowired
    private ExibicaoNoticiasRepository repository;

    public List<ExibicaoNoticias> listarTodas() {
        return repository.findAll();
    }

    public List<ExibicaoNoticias> listarPublicadas() {
        return repository.findByPublicadoTrue();
    }

    public Optional<ExibicaoNoticias> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public ExibicaoNoticias salvar(ExibicaoNoticias noticia) {
        return repository.save(noticia);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}