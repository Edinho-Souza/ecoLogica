package br.com.ecologica.visualizacao.repository;

import br.com.ecologica.visualizacao.ExibicaoOrientacoes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExibicaoOrientacoesRepository extends JpaRepository<ExibicaoOrientacoes, Long> {
    List<ExibicaoOrientacoes> findByAtivoTrue();
}