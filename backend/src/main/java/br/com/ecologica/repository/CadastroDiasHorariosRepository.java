package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastros.CadastroDiasHorarios;

public interface CadastroDiasHorariosRepository extends JpaRepository<CadastroDiasHorarios, Long> {
}