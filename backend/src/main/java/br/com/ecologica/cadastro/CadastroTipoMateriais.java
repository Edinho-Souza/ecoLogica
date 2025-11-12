package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
//Importações omitidas

@Entity
@Table(name = "tipos_materiais")
@Getter // Gera Getters
@Setter // Gera Setters
@NoArgsConstructor // Gera Construtor sem argumentos (padrão da JPA)
@ToString(exclude = "materiais") // Exclui a lista da string
@EqualsAndHashCode(exclude = "materiais") // Exclui a lista de equals/hashCode
public class CadastroTipoMateriais {

	// ... campos ...

	@OneToMany(mappedBy = "tipoMaterial")
	private List<CadastroMateriaisColetar> materiais;
}