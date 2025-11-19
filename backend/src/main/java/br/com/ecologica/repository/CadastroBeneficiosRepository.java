package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.CadastroBeneficios;

public interface CadastroBeneficiosRepository extends JpaRepository<CadastroBeneficios, Long> {
}