package br.com.ecologica.service;

import br.com.ecologica.CadastroEmpresasRecicladoras;
import br.com.ecologica.dto.SolicitacaoRequest;
import br.com.ecologica.dto.SolicitacaoResponse;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.repository.SolicitacoesRepository;
import br.com.ecologica.repository.UsuarioRepository;
import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacoesService {

    @Autowired
    private SolicitacoesRepository repository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CadastroEmpresasRecicladorasRepository recicladoraRepository;

    public VisualizacaoSolicitacoes criarSolicitacao(SolicitacaoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        CadastroEmpresasRecicladoras recicladora = recicladoraRepository.findById(request.getIdRecicladora())
                .orElseThrow(() -> new RuntimeException("Recicladora não encontrada"));

        VisualizacaoSolicitacoes solicitacao = new VisualizacaoSolicitacoes();
        solicitacao.setUsuario(usuario);
        solicitacao.setEmpresaRecicladora(recicladora);
        solicitacao.setDescricao(request.getDescricao());
        return repository.save(solicitacao);
    }

    public List<SolicitacaoResponse> obterSolicitacoes(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId)
                .stream()
                .map(SolicitacaoResponse::fromEntity)
                .collect(Collectors.toList());
    }
}