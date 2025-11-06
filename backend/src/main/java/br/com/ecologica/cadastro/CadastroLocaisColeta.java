package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "localcoleta")
public class CadastroLocaisColeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_local")
    private Long id;

    @Column(length = 100)
    private String nome; 

    @Column(length = 200)
    private String endereco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_recicladora")
    private CadastroEmpresasRecicladoras empresaRecicladora;
    
}