package br.com.ecologica.cadastro.empresasrecicladoras.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;

public interface CadastroEmpresasRecicladorasRepository extends JpaRepository<CadastroEmpresasRecicladoras, Long> {
    
}