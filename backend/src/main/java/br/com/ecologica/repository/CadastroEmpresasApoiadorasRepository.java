package br.com.ecologica.repository;

import br.com.ecologica.CadastroEmpresasApoiadoras;
import br.com.ecologica.model.StatusUsuario;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CadastroEmpresasApoiadorasRepository extends JpaRepository<CadastroEmpresasApoiadoras, Long> {
    List<CadastroEmpresasApoiadoras> findByUsuario_Status(StatusUsuario status);
}