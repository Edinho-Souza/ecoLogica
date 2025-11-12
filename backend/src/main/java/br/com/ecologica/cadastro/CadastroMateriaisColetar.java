package br.com.ecologica.cadastro;

import jakarta.persistence.*;
// Importações específicas do Lombok
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "materiais_coletar")
@Getter // Gera todos os getters
@Setter // Gera todos os setters
@NoArgsConstructor // Gera construtor sem argumentos (necessário pela JPA)
// EXCLUIR RELAÇÕES
@ToString(exclude = { "tipoMaterial", "localColeta" })
@EqualsAndHashCode(exclude = { "tipoMaterial", "localColeta" })
public class CadastroMateriaisColetar {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nomeMaterial;
	private String descricao;
	private boolean reciclavel;

	@ManyToOne
	@JoinColumn(name = "tipo_material_id")
	private CadastroTipoMateriais tipoMaterial;

	@ManyToOne
	@JoinColumn(name = "local_coleta_id")
	private CadastroLocaisColeta localColeta;
}