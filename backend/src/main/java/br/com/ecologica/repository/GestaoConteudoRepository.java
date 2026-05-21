package br.com.ecologica.repository;

import br.com.ecologica.gestao.GestaoConteudo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GestaoConteudoRepository extends JpaRepository<GestaoConteudo, Long> {
    Optional<GestaoConteudo> findFirstByTipoConteudoAndPublicadoTrueOrderByIdDesc(String tipoConteudo);
    List<GestaoConteudo> findByTipoConteudoAndPublicadoTrue(String tipoConteudo);
}
