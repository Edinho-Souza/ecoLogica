package br.com.ecologica.cadastro.locaiscoleta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.ecologica.cadastro.CadastroLocaisColeta;

public interface CadastroLocaisColetaRepository extends JpaRepository<CadastroLocaisColeta, Long> {
    // Métodos personalizados podem ser adicionados aqui, se necessário
}
