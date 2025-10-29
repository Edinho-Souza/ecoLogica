package br.com.ecologica.visualizacao.service;

import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;
import br.com.ecologica.visualizacao.dto.SolicitacaoResponse;
import br.com.ecologica.visualizacao.repository.SolicitacoesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacoesService {

    @Autowired
    private SolicitacoesRepository repository;

    public List<SolicitacaoResponse> obterSolicitacoes(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId)
                .stream()
                .map(SolicitacaoResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
