package br.com.ecologica.cadastro.empresasapoiadoras.repository;

import br.com.ecologica.cadastro.CadastroEmpresasApoiadoras;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CadastroEmpresasApoiadorasRepository extends JpaRepository<CadastroEmpresasApoiadoras, Long> {
    List<CadastroEmpresasApoiadoras> findByAprovadaTrue();
}