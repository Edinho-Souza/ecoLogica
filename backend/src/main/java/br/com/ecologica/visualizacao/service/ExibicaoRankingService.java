package br.com.ecologica.visualizacao.service;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import br.com.ecologica.visualizacao.ExibicaoRanking;
import br.com.ecologica.visualizacao.dto.RankingRequest;
import br.com.ecologica.visualizacao.repository.ExibicaoRankingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ExibicaoRankingService {

    @Autowired
    private ExibicaoRankingRepository repository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ExibicaoRanking> listarRanking() {
        return repository.findAllByOrderByPontosDesc(); 
    }

    public Optional<ExibicaoRanking> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public ExibicaoRanking salvar(RankingRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ExibicaoRanking ranking = new ExibicaoRanking();
        ranking.setUsuario(usuario);
        ranking.setPontos(request.getPontos());
        ranking.setPosicao(request.getPosicao());
        
        return repository.save(ranking);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}