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
    private String tipoMaterial;
    private String descricao;
    private boolean reciclavel;
}