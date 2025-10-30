package br.com.ecologica.gestao.repository;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissaoUsoPontosRepository extends JpaRepository<PermissaoUsoPontos, Long> {
    List<PermissaoUsoPontos> findByUsuarioId(Long usuarioId);
}
