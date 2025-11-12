package br.com.ecologica.cadastro;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
// Importação útil para validação de Strings (Se usar Spring Framework)
import org.springframework.util.StringUtils; 

/**
 * Entidade JPA para mapear os dias e horários de cadastro.
 * A anotação @Data (Lombok) gera automaticamente Getters, Setters, toString, etc.
 */
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

    /**
     * Lógica para definir e validar se os horários estão preenchidos,
     * e então marcar a entidade como ativa.
     */
    public void definirHorario() {
        // Verifica se os campos essenciais estão preenchidos.
        boolean camposPreenchidos = StringUtils.hasText(this.diaSemana) &&
                                    StringUtils.hasText(this.horarioInicio) &&
                                    StringUtils.hasText(this.horarioFim);

        if (camposPreenchidos) {
            this.setAtivo(true);
        } else {
            this.setAtivo(false);

        }
    }

	public boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
    
}