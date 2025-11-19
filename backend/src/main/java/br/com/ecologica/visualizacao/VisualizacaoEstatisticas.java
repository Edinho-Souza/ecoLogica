package br.com.ecologica.visualizacao;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import br.com.ecologica.model.Usuario;
import lombok.Data;

@Data
@Entity
@Table(name = "estatistica") //
public class VisualizacaoEstatisticas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_estatistica")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_usuario")
	private Usuario usuario;

	@Column(length = 100)
	private String tipo;

	@Column(precision = 10, scale = 2)
	private BigDecimal valor;

	@Column(name = "data")
	private LocalDate data;
}