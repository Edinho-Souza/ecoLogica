package br.com.ecologica.gestao.repository;

import br.com.ecologica.gestao.GestaoConteudo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GestaoConteudoRepository extends JpaRepository<GestaoConteudo, Long> {
}