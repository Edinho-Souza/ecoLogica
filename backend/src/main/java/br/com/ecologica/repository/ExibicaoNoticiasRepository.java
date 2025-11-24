package br.com.ecologica.repository;

import br.com.ecologica.visualizacao.ExibicaoNoticias;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExibicaoNoticiasRepository extends JpaRepository<ExibicaoNoticias, Long> {
}