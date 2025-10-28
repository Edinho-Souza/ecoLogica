package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "empresas_recicladoras")
public class CadastroEmpresasRecicladoras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeEmpresa;
    private String cidade;
    private boolean ativa;

    @Column(nullable = false)
    private boolean aprovada;

    @ManyToMany
    @JoinTable(
        name = "empresa_recicladora_tipo_material",
        joinColumns = @JoinColumn(name = "empresa_id"),
        inverseJoinColumns = @JoinColumn(name = "tipo_material_id")
    )
    private List<CadastroTipoMateriais> tiposMateriais;
}