package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "campanha")
public class CadastroCampanhas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campanha")
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Lob
    private String descricao;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_apoiadora")
    private CadastroEmpresasApoiadoras empresaApoiadora;

}