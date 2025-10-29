package br.com.ecologica.pontuacao.service;

import br.com.ecologica.pontuacao.dto.PontuacaoResponse;
import br.com.ecologica.pontuacao.repository.RegistroPontuacaoRepository;
import br.com.ecologica.pontuacao.RegistroPontuacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PontuacaoService {

    @Autowired
    private RegistroPontuacaoRepository registroRepository;

    public PontuacaoResponse obterPontuacao(Long usuarioId) {
        List<RegistroPontuacao> registros = registroRepository.findByUsuarioId(usuarioId);
        int totalPontos = registros.stream().mapToInt(RegistroPontuacao::getPontos).sum();

        PontuacaoResponse response = new PontuacaoResponse();
        response.setUsuarioId(usuarioId);
        response.setPontosTotal(totalPontos);
        return response;
    }

    public List<PontuacaoResponse> obterHistorico(Long usuarioId) {
        return registroRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(registro -> {
                    PontuacaoResponse r = new PontuacaoResponse();
                    r.setUsuarioId(usuarioId);
                    r.setPontosTotal(registro.getPontos());
                    r.setAtividade(registro.getAtividade());
                    r.setDataRegistro(registro.getDataRegistro());
                    return r;
                })
                .collect(Collectors.toList());
    }
}