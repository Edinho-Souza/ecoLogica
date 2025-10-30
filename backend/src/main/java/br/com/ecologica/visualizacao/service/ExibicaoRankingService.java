package br.com.ecologica.visualizacao.service;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import br.com.ecologica.visualizacao.repository.ExibicaoRankingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExibicaoRankingService {

	@Autowired
	private ExibicaoRankingRepository repository;

	public List<ExibicaoRanking> listarRanking() {
		return repository.findAllByOrderByPontuacaoDesc();
	}

	public Optional<ExibicaoRanking> buscarPorId(Long id) {
		return repository.findById(id);
	}

	public ExibicaoRanking salvar(ExibicaoRanking ranking) {
		return repository.save(ranking);
	}

	public void deletar(Long id) {
		repository.deleteById(id);
	}
}
