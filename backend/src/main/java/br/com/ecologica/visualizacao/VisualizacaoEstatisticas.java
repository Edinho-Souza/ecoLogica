package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "visualizacao_estatisticas")
public class VisualizacaoEstatisticas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipoEstatistica;
    private String descricao;
    private boolean visivel;

    public void visualizarEstatisticas() {
        // lógica para exibir estatísticas ao usuário
    }
}
