package br.com.ecologica.cadastro;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    public void cadastrarCampanha() {
        // lógica de cadastro de campanha
    }
}
