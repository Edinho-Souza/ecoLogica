package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "visualizacao_solicitacoes")
public class VisualizacaoSolicitacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;
    private String tipoSolicitacao;
    private String status;

    public void visualizarSolicitacoes() {
        // lógica para exibir solicitações feitas pelo usuário
    }
}