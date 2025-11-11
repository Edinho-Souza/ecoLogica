package br.com.ecologica.visualizacao.repository;

import br.com.ecologica.visualizacao.ExibicaoRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExibicaoRankingRepository extends JpaRepository<ExibicaoRanking, Long> {
    
    List<ExibicaoRanking> findAllByOrderByPontosDesc();
    
    Optional<ExibicaoRanking> findByUsuario_Id(Long usuarioId);
}