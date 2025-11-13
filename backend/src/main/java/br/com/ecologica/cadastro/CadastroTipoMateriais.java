package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.List;

@Entity
@Table(name = "tipos_materiais")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "materiais")
@EqualsAndHashCode(exclude = "materiais")
public class CadastroTipoMateriais {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nome_tipo", length = 255)
	private String nomeTipo;

	@Lob
	private String descricao;

	@Column(nullable = false)
	private boolean ativo = false;

	@OneToMany(mappedBy = "tipoMaterial")
	private List<CadastroMateriaisColetar> materiais;
}