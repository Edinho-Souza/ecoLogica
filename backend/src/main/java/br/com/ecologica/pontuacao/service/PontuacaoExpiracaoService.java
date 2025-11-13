package br.com.ecologica.pontuacao.service;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import br.com.ecologica.visualizacao.HistoricoPontuacao;
import br.com.ecologica.visualizacao.repository.ExibicaoRankingRepository;
import br.com.ecologica.visualizacao.repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@EnableScheduling
public class PontuacaoExpiracaoService {

	@Autowired
	private HistoricoRepository historicoRepository;

	@Autowired
	private ExibicaoRankingRepository rankingRepository;

	@Transactional
	@Scheduled(cron = "0 0 1 * * ?") // 1:00 AM todo dia
	public void expirarPontosAntigos() {
		System.out.println("Iniciando job de expiração de pontos...");

		LocalDateTime dataExpiracao = LocalDateTime.now().minusMonths(12);

		// Encontra todos os registros de PONTOS GANHOS (pontos > 0)
		// que ainda NÃO EXPIRARAM e são de 12 MESES ATRÁS ou mais.
		List<HistoricoPontuacao> registrosParaExpirar = historicoRepository
				.findByPontosGreaterThanAndExpiradoFalseAndDataBefore(0, dataExpiracao);

		if (registrosParaExpirar.isEmpty()) {
			System.out.println("Nenhum ponto para expirar hoje.");
			return;
		}

		// Agrupa os pontos a expirar por ID de usuário
		Map<Long, Integer> pontosPorUsuario = registrosParaExpirar.stream().collect(Collectors
				.groupingBy(h -> h.getUsuario().getId(), Collectors.summingInt(HistoricoPontuacao::getPontos)));

		// Itera sobre cada usuário e atualiza seu ranking
		for (Map.Entry<Long, Integer> entry : pontosPorUsuario.entrySet()) {
			Long usuarioId = entry.getKey();
			int pontosExpirados = entry.getValue();

			Optional<ExibicaoRanking> rankingOpt = rankingRepository.findByUsuario_Id(usuarioId);

			if (rankingOpt.isPresent()) {
				ExibicaoRanking ranking = rankingOpt.get();
				int pontosAtuais = ranking.getPontos();

				// Subtrai os pontos (garante que não fique negativo pela expiração)
				ranking.setPontos(Math.max(0, pontosAtuais - pontosExpirados));
				rankingRepository.save(ranking);
			}
		}

		// Marca todos os registros processados como expirados
		for (HistoricoPontuacao historico : registrosParaExpirar) {
			historico.setExpirado(true);
		}
		historicoRepository.saveAll(registrosParaExpirar);

		System.out.println(
				"Job de expiração de pontos concluído. " + registrosParaExpirar.size() + " registros atualizados.");
	}
}