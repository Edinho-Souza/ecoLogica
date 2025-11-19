package br.com.ecologica.visualizacao;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import br.com.ecologica.model.Usuario;

@Data
@Entity
@Table(name = "historico")
public class HistoricoPontuacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(length = 200)
    private String descricao;

    @Column(name = "pontos", nullable = false)
    private int pontos;

    @Column(name = "expirado", nullable = false)
    private boolean expirado = false;

    @Column(name = "data", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime data;
}