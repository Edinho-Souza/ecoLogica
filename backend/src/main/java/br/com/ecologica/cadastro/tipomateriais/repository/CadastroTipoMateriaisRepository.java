package br.com.ecologica.cadastro.tipomateriais.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastro.CadastroTipoMateriais;

public interface CadastroTipoMateriaisRepository extends JpaRepository<CadastroTipoMateriais, Long> {
    
}
