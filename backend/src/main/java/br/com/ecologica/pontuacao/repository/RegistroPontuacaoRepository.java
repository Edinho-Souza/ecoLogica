package br.com.ecologica.pontuacao.repository;

import br.com.ecologica.pontuacao.RegistroPontuacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistroPontuacaoRepository extends JpaRepository<RegistroPontuacao, Long> {
    List<RegistroPontuacao> findByUsuarioId(Long usuarioId);
}