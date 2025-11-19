package br.com.ecologica;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "beneficio")
public class CadastroBeneficios {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_beneficio")
	private Long id;

	@Column(nullable = false, length = 100)
	private String titulo;

	@Lob
	private String descricao;

	@Column(name = "pontos_necessarios", nullable = false)
	private int pontosNecessarios;

}