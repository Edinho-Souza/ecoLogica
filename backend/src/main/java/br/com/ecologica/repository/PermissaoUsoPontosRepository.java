package br.com.ecologica.repository;

import br.com.ecologica.gestao.PermissaoUsoPontos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PermissaoUsoPontosRepository extends JpaRepository<PermissaoUsoPontos, Long> {
    List<PermissaoUsoPontos> findByUsuario_Id(Long usuarioId);
}