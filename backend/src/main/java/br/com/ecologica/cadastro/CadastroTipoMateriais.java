package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "tipos_materiais")
public class CadastroTipoMateriais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeTipo;
    private String descricao;
    private boolean ativo;

    @OneToMany(mappedBy = "tipoMaterial")
    private List<CadastroMateriaisColetar> materiais;
}