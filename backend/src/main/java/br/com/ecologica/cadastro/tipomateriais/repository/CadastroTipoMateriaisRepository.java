package br.com.ecologica.cadastro.tipomateriais.repository;

import br.com.ecologica.cadastro.CadastroTipoMateriais;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CadastroTipoMateriaisRepository extends JpaRepository<CadastroTipoMateriais, Long> {
}