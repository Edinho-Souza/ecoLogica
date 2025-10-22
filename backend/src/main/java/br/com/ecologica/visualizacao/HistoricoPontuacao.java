package br.com.ecologica.visualizacao;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "historico_pontuacao")
public class HistoricoPontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;

    @ElementCollection
    private List<Integer> pontuacoes;

    private LocalDateTime ultimaAtualizacao;

    public void mostrarHistorico() {
        // lógica para exibir histórico de pontuação
    }
}