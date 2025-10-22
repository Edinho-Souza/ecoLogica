package br.com.ecologica.cadastro;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "cadastro_beneficios")
public class CadastroBeneficios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeBeneficio;
    private String descricao;
    private boolean ativo;

    public void cadastrar() {
        // lógica de cadastro de benefício
    }
}