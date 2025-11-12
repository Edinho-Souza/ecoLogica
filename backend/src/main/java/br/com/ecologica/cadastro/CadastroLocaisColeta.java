package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor; // Boa prática para entidades JPA

@Entity
@Table(name = "localcoleta")
// Substituir @Data por componentes específicos e excluir o relacionamento
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "empresaRecicladora")
@EqualsAndHashCode(exclude = "empresaRecicladora")
public class CadastroLocaisColeta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_local")
	private Long id;

	@Column(length = 100)
	private String nome;

	@Column(length = 200)
	private String endereco;

	// Relação ManyToOne
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_recicladora")
	private CadastroEmpresasRecicladoras empresaRecicladora;
}