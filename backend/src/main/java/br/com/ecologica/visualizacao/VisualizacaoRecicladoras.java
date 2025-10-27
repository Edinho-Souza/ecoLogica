package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "visualizacao_recicladoras")
public class VisualizacaoRecicladoras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeEmpresa;
    private String cidade;
    private boolean ativa;

    public void listarRecicladoras() {
        // lógica para exibir empresas recicladoras
    }
}