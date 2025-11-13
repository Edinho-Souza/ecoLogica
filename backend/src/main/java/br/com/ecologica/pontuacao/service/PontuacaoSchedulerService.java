package br.com.ecologica.pontuacao.service;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import br.com.ecologica.visualizacao.HistoricoPontuacao;
import br.com.ecologica.visualizacao.repository.ExibicaoRankingRepository;
import br.com.ecologica.visualizacao.repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Serviço agendado (Scheduler) para implementar a Regra de Negócio RN008:
 * Expiração de pontos após 12 meses.
 */
@Service
public class PontuacaoSchedulerService {

    @Autowired
    private HistoricoRepository historicoRepository;

    @Autowired
    private ExibicaoRankingRepository rankingRepository;

    // Define a validade dos pontos (12 meses)
    private static final int MESES_VALIDADE_PONTOS = 12;

    /**
     * Este método roda automaticamente.
     * "cron" = "0 0 3 * * ?" significa "Todo dia, às 3h da manhã".
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void expirarPontosAntigos() {
        System.out.println("Iniciando rotina de expiração de pontos...");

        LocalDateTime dataLimite = LocalDateTime.now().minusMonths(MESES_VALIDADE_PONTOS);

        // Busca todos os registros de pontos Ganhos (> 0), Não Expirados
        // e anteriores à data limite (12 meses atrás).
        List<HistoricoPontuacao> pontosParaExpirar = historicoRepository
                .findByPontosGreaterThanAndExpiradoFalseAndDataBefore(0, dataLimite);

        if (pontosParaExpirar.isEmpty()) {
            System.out.println("Nenhum ponto para expirar.");
            return;
        }

        // Agrupa os pontos por usuário
        Map<Long, Integer> pontosExpiradosPorUsuario = pontosParaExpirar.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getUsuario().getId(),
                        Collectors.summingInt(HistoricoPontuacao::getPontos)));

        // Atualiza os registros de histórico para "expirado = true"
        for (HistoricoPontuacao historico : pontosParaExpirar) {
            historico.setExpirado(true);
        }
        historicoRepository.saveAll(pontosParaExpirar);

        // Atualiza o ranking (pontuação total) de cada usuário afetado
        for (Map.Entry<Long, Integer> entry : pontosExpiradosPorUsuario.entrySet()) {
            Long usuarioId = entry.getKey();
            int pontosARemover = entry.getValue();

            // Busca o ranking do usuário
            rankingRepository.findByUsuario_Id(usuarioId).ifPresent(ranking -> {
                int pontosAtuais = ranking.getPontos();
                ranking.setPontos(pontosAtuais - pontosARemover);
                rankingRepository.save(ranking);

                // Cria um novo registro no histórico informando a expiração
                HistoricoPontuacao historicoExpiracao = new HistoricoPontuacao();
                historicoExpiracao.setUsuario(ranking.getUsuario());
                historicoExpiracao.setDescricao(pontosARemover + " pontos expirados (val." + MESES_VALIDADE_PONTOS + " meses)");
                historicoExpiracao.setPontos(-pontosARemover); 
                historicoExpiracao.setExpirado(true); 
                historicoRepository.save(historicoExpiracao);
            });
        }
        System.out.println("Rotina de expiração de pontos concluída. Usuários afetados: " + pontosExpiradosPorUsuario.size());
    }
}