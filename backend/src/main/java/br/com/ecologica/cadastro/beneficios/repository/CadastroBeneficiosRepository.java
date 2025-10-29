package br.com.ecologica.cadastro.beneficios.repository;

import br.com.ecologica.cadastro.CadastroBeneficios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CadastroBeneficiosRepository extends JpaRepository<CadastroBeneficios, Long> {
}