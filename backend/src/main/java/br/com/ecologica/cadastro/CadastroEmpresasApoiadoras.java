package br.com.ecologica.cadastro;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "cadastro_empresas_apoiadoras")
public class CadastroEmpresasApoiadoras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeEmpresa;
    private String cnpj;
    private String contato;
    private boolean ativa;

    @Column(nullable = false)
    private boolean aprovada;

    @OneToMany(mappedBy = "empresaApoiadora")
    private List<CadastroCampanhas> campanhas;

    public void registrarEmpresa() {
        // lógica para registrar empresa apoiadora
    }
}