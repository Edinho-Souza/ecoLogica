package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "visualizacao_beneficios")
public class VisualizacaoBeneficios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeBeneficio;
    private String descricao;
    private boolean disponivel;

    public void visualizar() {
        // lógica para exibir benefícios disponíveis ao usuário
    }
}