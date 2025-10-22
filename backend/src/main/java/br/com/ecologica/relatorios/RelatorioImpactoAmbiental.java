package br.com.ecologica.relatorios;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "relatorio_impacto_ambiental")
public class RelatorioImpactoAmbiental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;
    private String tipoImpacto;
    private double reducaoCO2;

    public void gerarRelatorio() {
        // lógica para gerar relatório de impacto ambiental
    }
}