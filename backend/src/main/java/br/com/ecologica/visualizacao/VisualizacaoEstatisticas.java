package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Data;


@Data
@Entity
@Table(name = "estatistica")
public class VisualizacaoEstatisticas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_estatistica;
    private Long id_usuario;
    private String tipo;
    private Double valor;
    private LocalDate data;
    private boolean visivel;

    public void visualizarEstatisticas() {
        // lógica para exibir estatísticas ao usuário
    }
}
