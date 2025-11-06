package br.com.ecologica.visualizacao.repository;

import br.com.ecologica.visualizacao.VisualizacaoEstatisticas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EstatisticasRepository extends JpaRepository<VisualizacaoEstatisticas, Long> {
    List<VisualizacaoEstatisticas> findByUsuario_Id(Long usuarioId);
}