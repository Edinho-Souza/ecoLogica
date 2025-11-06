package br.com.ecologica.visualizacao.repository;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExibicaoRankingRepository extends JpaRepository<ExibicaoRanking, Long> {
    List<ExibicaoRanking> findAllByOrderByPontosDesc(); 
}