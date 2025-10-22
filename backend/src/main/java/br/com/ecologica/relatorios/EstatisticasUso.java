package br.com.ecologica.relatorios;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "estatisticas_uso")
public class EstatisticasUso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int totalAcessos;
    private int totalUsuarios;
    private int totalPontuacoes;

    public void gerarEstatisticas() {
        // lógica para gerar estatísticas de uso
    }
}