package br.com.ecologica.visualizacao.service;

import br.com.ecologica.visualizacao.dto.HistoricoResponse;
import br.com.ecologica.visualizacao.repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoricoService {

    @Autowired
    private HistoricoRepository repository;

    public List<HistoricoResponse> obterHistorico(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId)
                .stream()
                .map(HistoricoResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
