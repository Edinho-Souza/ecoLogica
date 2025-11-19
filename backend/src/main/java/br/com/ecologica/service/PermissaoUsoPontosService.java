package br.com.ecologica.service;

import br.com.ecologica.dto.PermissaoUsoPontosRequest;
import br.com.ecologica.gestao.PermissaoUsoPontos;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.PermissaoUsoPontosRepository;
import br.com.ecologica.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PermissaoUsoPontosService {

    @Autowired
    private PermissaoUsoPontosRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public PermissaoUsoPontos salvar(PermissaoUsoPontosRequest request) {
        // Busca a entidade Usuario real
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PermissaoUsoPontos permissao = new PermissaoUsoPontos();
        permissao.setUsuario(usuario);
        permissao.setPermitido(request.isPermitido());
        permissao.setMotivo(request.getMotivo());
        
        return repository.save(permissao);
    }

    public List<PermissaoUsoPontos> listarTodos() {
        return repository.findAll();
    }

    public Optional<PermissaoUsoPontos> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public List<PermissaoUsoPontos> buscarPorUsuarioId(Long usuarioId) {
        return repository.findByUsuario_Id(usuarioId);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Permissão não encontrada");
        }
        repository.deleteById(id);
    }
}