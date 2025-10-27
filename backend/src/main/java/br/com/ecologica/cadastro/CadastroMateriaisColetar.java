package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "materiais_coletar")
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