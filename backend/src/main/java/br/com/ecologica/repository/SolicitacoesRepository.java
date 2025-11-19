package br.com.ecologica.repository;

import br.com.ecologica.visualizacao.VisualizacaoSolicitacoes;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitacoesRepository extends JpaRepository<VisualizacaoSolicitacoes, Long> {
    List<VisualizacaoSolicitacoes> findByUsuarioId(Long usuarioId);
}