package br.com.ecologica.cadastro;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "cadastro_dias_horarios")
public class CadastroDiasHorarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String diaSemana;
    private String horarioInicio;
    private String horarioFim;
    private boolean ativo;

    public void definirHorario() {
        // lógica para definir horários de funcionamento
    }
}