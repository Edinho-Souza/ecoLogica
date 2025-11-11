package br.com.ecologica.visualizacao;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "ranking")
@NoArgsConstructor
public class ExibicaoRanking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ranking")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "pontos")
    private int pontos;

    @Column(name = "posicao")
    private int posicao;

    public ExibicaoRanking(Usuario usuario) {
        this.usuario = usuario;
        this.pontos = 0;
        this.posicao = 0; 
    }
}