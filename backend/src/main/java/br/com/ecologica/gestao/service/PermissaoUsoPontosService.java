package br.com.ecologica.gestao.service;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import br.com.ecologica.gestao.repository.PermissaoUsoPontosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissaoUsoPontosService {

    @Autowired
    private PermissaoUsoPontosRepository repository;

    public PermissaoUsoPontos salvar(PermissaoUsoPontos permissao) {
        return repository.save(permissao);
    }

    public List<PermissaoUsoPontos> listarTodos() {
        return repository.findAll();
    }

    public Optional<PermissaoUsoPontos> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public List<PermissaoUsoPontos> buscarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
