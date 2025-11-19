package br.com.ecologica.service;

import br.com.ecologica.dto.HistoricoResponse;
import br.com.ecologica.repository.HistoricoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoricoService {

    @Autowired
    private HistoricoRepository repository;

    public List<HistoricoResponse> obterHistorico(Long usuarioId) {
        return repository.findByUsuario_Id(usuarioId)
                .stream()
                .map(HistoricoResponse::fromEntity)
                .collect(Collectors.toList());
    }
}