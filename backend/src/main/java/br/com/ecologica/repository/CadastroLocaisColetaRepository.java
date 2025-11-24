package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastros.CadastroLocaisColeta;

public interface CadastroLocaisColetaRepository extends JpaRepository<CadastroLocaisColeta, Long> {
  
}
