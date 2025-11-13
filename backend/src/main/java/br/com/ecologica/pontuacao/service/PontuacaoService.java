package br.com.ecologica.pontuacao.service;

import br.com.ecologica.cadastro.CadastroBeneficios;
import br.com.ecologica.cadastro.beneficios.repository.CadastroBeneficiosRepository;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.cadastro.usuarios.repository.UsuarioRepository;
import br.com.ecologica.pontuacao.dto.PontuacaoRequest;
import br.com.ecologica.pontuacao.dto.PontuacaoResponse;
import br.com.ecologica.pontuacao.dto.ResgateBeneficioRequest;
import br.com.ecologica.visualizacao.ExibicaoRanking;
import br.com.ecologica.visualizacao.HistoricoPontuacao;
import br.com.ecologica.visualizacao.repository.ExibicaoRankingRepository;
import br.com.ecologica.visualizacao.repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PontuacaoService {
    @Autowired
    private ExibicaoRankingRepository rankingRepository;
    @Autowired
    private HistoricoRepository historicoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CadastroBeneficiosRepository beneficioRepository;

    @Transactional
    public ExibicaoRanking atribuirPontos(PontuacaoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        ExibicaoRanking ranking = rankingRepository.findByUsuario_Id(request.getIdUsuario())
                .orElse(new ExibicaoRanking(usuario));
        
        ranking.setPontos(ranking.getPontos() + request.getPontos());
        ExibicaoRanking rankingSalvo = rankingRepository.save(ranking);
        
        HistoricoPontuacao historico = new HistoricoPontuacao();
        historico.setUsuario(usuario);
        
        // Salva os pontos e a descrição em campos separados
        historico.setDescricao(request.getAtividade());
        historico.setPontos(request.getPontos());
        historico.setExpirado(false); // Marca como não expirado
        
        historicoRepository.save(historico);
        return rankingSalvo;
    }

    @Transactional
    public ExibicaoRanking resgatarBeneficio(ResgateBeneficioRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        CadastroBeneficios beneficio = beneficioRepository.findById(request.getIdBeneficio())
                .orElseThrow(() -> new RuntimeException("Benefício não encontrado"));
        
        ExibicaoRanking ranking = rankingRepository.findByUsuario_Id(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Ranking do usuário não encontrado"));
        
        int pontosNecessarios = beneficio.getPontosNecessarios();
        int pontosAtuais = ranking.getPontos();
        
        if (pontosAtuais < pontosNecessarios) {
            throw new RuntimeException("Pontos insuficientes para resgatar este benefício.");
        }
        
        ranking.setPontos(pontosAtuais - pontosNecessarios);
        ExibicaoRanking rankingAtualizado = rankingRepository.save(ranking);
        
        HistoricoPontuacao historico = new HistoricoPontuacao();
        historico.setUsuario(usuario);
        
        // Salva os pontos (negativos) e a descrição em campos separados
        historico.setDescricao("Resgate do benefício: '" + beneficio.getTitulo() + "'");
        historico.setPontos(-pontosNecessarios); // Pontos de resgate são negativos
        historico.setExpirado(true); // Pontos de resgate não expiram (já estão gastos)
        
        historicoRepository.save(historico);
        return rankingAtualizado;
    }

    public PontuacaoResponse obterPontuacao(Long usuarioId) {
        int totalPontos = rankingRepository.findByUsuario_Id(usuarioId)
                .map(ExibicaoRanking::getPontos)
                .orElse(0);
        
        PontuacaoResponse response = new PontuacaoResponse();
        response.setUsuarioId(usuarioId);
        response.setPontosTotal(totalPontos);
        return response;
    }
}