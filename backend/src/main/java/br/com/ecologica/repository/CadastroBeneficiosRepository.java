package br.com.ecologica.repository;

import br.com.ecologica.cadastros.CadastroBeneficios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CadastroBeneficiosRepository extends JpaRepository<CadastroBeneficios, Long> {	
}