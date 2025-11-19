package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.List;

@Data
@Entity
@Table(name = "localcoleta")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CadastroLocaisColeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_local")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(length = 100)
    private String nome;

    @Column(length = 200)
    private String endereco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_recicladora")
    @ToString.Exclude // Evita loop infinito no log
    private CadastroEmpresasRecicladoras empresaRecicladora;

    @OneToMany(mappedBy = "localColeta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CadastroDiasHorarios> diasHorarios;

    // Mapeamento correto para a tabela de junção criada no SQL
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "localcoleta_tipos_materiais",
        joinColumns = @JoinColumn(name = "local_id"),
        inverseJoinColumns = @JoinColumn(name = "tipo_id")
    )
    @ToString.Exclude
    private List<CadastroTipoMateriais> tiposMateriaisAceitos;
}