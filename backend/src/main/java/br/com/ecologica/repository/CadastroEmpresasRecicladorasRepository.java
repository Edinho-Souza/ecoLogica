package br.com.ecologica.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastros.CadastroEmpresasRecicladoras;

public interface CadastroEmpresasRecicladorasRepository extends JpaRepository<CadastroEmpresasRecicladoras, Long> {
    boolean existsByCnpj(String cnpj);
}
