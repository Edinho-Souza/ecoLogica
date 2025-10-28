package br.com.ecologica.pontuacao;

import br.com.ecologica.cadastro.CadastroUsuarios;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "atribuicao_pontuacao")
public class AtribuicaoPontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int pontos;
    private String motivo;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private CadastroUsuarios usuario;

    public void atribuir(int valor) {
        this.pontos += valor;
    }
}