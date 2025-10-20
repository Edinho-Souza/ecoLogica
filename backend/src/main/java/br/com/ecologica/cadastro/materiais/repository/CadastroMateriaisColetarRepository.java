package br.com.ecologica.cadastro.materiais.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastro.CadastroMateriaisColetar;

public interface CadastroMateriaisColetarRepository extends JpaRepository<CadastroMateriaisColetar, Long> {
    
}