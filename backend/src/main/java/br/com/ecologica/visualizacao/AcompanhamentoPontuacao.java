package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "acompanhamento_pontuacao")
public class AcompanhamentoPontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;
    private int pontosAtual;
    private int pontosMensais;

    public void acompanhar() {
        // lógica para acompanhar evolução da pontuação
    }
}