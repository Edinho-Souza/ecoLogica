package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.CadastroEmpresasRecicladoras;

public interface CadastroEmpresasRecicladorasRepository extends JpaRepository<CadastroEmpresasRecicladoras, Long> {
    
}