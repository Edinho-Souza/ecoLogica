package br.com.ecologica;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "tipos_materiais")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "locaisColeta")
@EqualsAndHashCode(exclude = "locaisColeta")
public class CadastroTipoMateriais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_tipo", length = 255)
    private String nomeTipo;

    @Lob
    private String descricao;

    @Column(nullable = false)
    private boolean ativo = true;

    @ManyToMany(mappedBy = "tiposMateriaisAceitos", fetch = FetchType.LAZY)
    private List<CadastroLocaisColeta> locaisColeta;
}