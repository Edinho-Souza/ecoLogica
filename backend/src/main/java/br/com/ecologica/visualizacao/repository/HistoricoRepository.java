package br.com.ecologica.visualizacao.repository;

import br.com.ecologica.visualizacao.HistoricoPontuacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface HistoricoRepository extends JpaRepository<HistoricoPontuacao, Long> {

    List<HistoricoPontuacao> findByUsuario_Id(Long usuarioId);

    // Método para encontrar pontos ganhos, não expirados e antigos
    List<HistoricoPontuacao> findByPontosGreaterThanAndExpiradoFalseAndDataBefore(
            int pontos, LocalDateTime dataLimite);
}