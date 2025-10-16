package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "locais_coleta")
public class CadastroLocaisColeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeLocal;

    private String endereco;

    private String cidade;

    private String estado;

    private String horarioFuncionamento;

    private boolean ativo;
}
