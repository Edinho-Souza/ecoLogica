package br.com.ecologica.visualizacao.repository;

import br.com.ecologica.visualizacao.HistoricoPontuacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoricoRepository extends JpaRepository<HistoricoPontuacao, Long> {
    List<HistoricoPontuacao> findByUsuarioId(Long usuarioId);
}
