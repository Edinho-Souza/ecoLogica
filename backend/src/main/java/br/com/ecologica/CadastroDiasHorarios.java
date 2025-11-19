package br.com.ecologica;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cadastro_dias_horarios")
public class CadastroDiasHorarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "local_coleta_id", nullable = false)
    private CadastroLocaisColeta localColeta;

    private String diaSemana;
    private String horarioInicio;
    private String horarioFim;
    private boolean ativo;

}