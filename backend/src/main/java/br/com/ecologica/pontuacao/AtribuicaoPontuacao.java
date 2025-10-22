package br.com.ecologica.pontuacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "atribuicao_pontuacao")
public class AtribuicaoPontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;
    private int pontos;
    private String motivo;

    public void atribuir(int valor) {
        this.pontos += valor;
    }
}