package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.CadastroTipoMateriais;

public interface CadastroTipoMateriaisRepository extends JpaRepository<CadastroTipoMateriais, Long> {
}