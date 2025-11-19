package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.CadastroCampanhas;

import java.time.LocalDate;
import java.util.List;

public interface CadastroCampanhasRepository extends JpaRepository<CadastroCampanhas, Long> {

    List<CadastroCampanhas> findByDataInicioLessThanEqualAndDataFimGreaterThanEqual(
        LocalDate dataInicio, LocalDate dataFim
    );
}