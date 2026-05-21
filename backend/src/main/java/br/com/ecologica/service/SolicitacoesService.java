package br.com.ecologica.service;

import br.com.ecologica.cadastros.CadastroEmpresasRecicladoras;
import br.com.ecologica.dto.SolicitacaoRequest;
import br.com.ecologica.dto.SolicitacaoResponse;
import br.com.ecologica.exception.ResourceNotFoundException;
import br.com.ecologica.model.StatusSolicitacao;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.CadastroEmpresasRecicladorasRepository;
import br.com.ecologica.repository.SolicitacoesRepository;
import br.com.ecologica.repository.UsuarioRepository;
import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SolicitacoesService {

    private final SolicitacoesRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final CadastroEmpresasRecicladorasRepository recicladoraRepository;

    public SolicitacoesService(
            SolicitacoesRepository repository,
            UsuarioRepository usuarioRepository,
            CadastroEmpresasRecicladorasRepository recicladoraRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.recicladoraRepository = recicladoraRepository;
    }

    @Transactional
    public VisualizacaoSolicitacoes criarSolicitacao(SolicitacaoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        CadastroEmpresasRecicladoras recicladora = recicladoraRepository.findById(request.getIdRecicladora())
                .orElseThrow(() -> new ResourceNotFoundException("Recicladora nao encontrada."));

        VisualizacaoSolicitacoes solicitacao = new VisualizacaoSolicitacoes();
        solicitacao.setUsuario(usuario);
        solicitacao.setEmpresaRecicladora(recicladora);
        solicitacao.setDescricao(request.getDescricao());
        solicitacao.setStatus(StatusSolicitacao.pendente);
        return repository.save(solicitacao);
    }

    public List<SolicitacaoResponse> obterSolicitacoesUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    public List<SolicitacaoResponse> obterSolicitacoesRecicladora(Long recicladoraId) {
        return repository.findByEmpresaRecicladora_Id(recicladoraId).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    @Transactional
    public VisualizacaoSolicitacoes atualizarStatus(Long id, StatusSolicitacao status) {
        VisualizacaoSolicitacoes solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitacao nao encontrada."));
        solicitacao.setStatus(status);
        return repository.save(solicitacao);
    }
}
