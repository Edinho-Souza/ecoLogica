package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cadastro_campanhas")
public class CadastroCampanhas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeCampanha;
    private String descricao;
    private boolean ativa;

    @ManyToOne
    @JoinColumn(name = "empresa_apoiadora_id")
    private CadastroEmpresasApoiadoras empresaApoiadora;

    public void cadastrarCampanha() {
        // lógica de cadastro de campanha
    }
}