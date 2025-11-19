package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.CadastroLocaisColeta;

public interface CadastroLocaisColetaRepository extends JpaRepository<CadastroLocaisColeta, Long> {
  
}
