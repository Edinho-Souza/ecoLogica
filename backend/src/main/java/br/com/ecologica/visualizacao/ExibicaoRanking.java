package br.com.ecologica.visualizacao;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ranking") 
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

}