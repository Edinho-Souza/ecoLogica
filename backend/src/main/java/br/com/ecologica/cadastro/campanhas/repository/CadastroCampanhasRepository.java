package br.com.ecologica.cadastro.campanhas.repository;

import br.com.ecologica.cadastro.CadastroCampanhas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface CadastroCampanhasRepository extends JpaRepository<CadastroCampanhas, Long> {

    List<CadastroCampanhas> findByDataInicioLessThanEqualAndDataFimGreaterThanEqual(
        LocalDate dataInicio, LocalDate dataFim
    );
}