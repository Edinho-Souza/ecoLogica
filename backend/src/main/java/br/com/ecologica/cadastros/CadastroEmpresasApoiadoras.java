package br.com.ecologica.cadastros;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import br.com.ecologica.model.Usuario;

@Data
@Entity
@Table(name = "empresaapoiadora") 
public class CadastroEmpresasApoiadoras {

    @Id
    @Column(name = "id_apoiadora")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_apoiadora") 
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 18) 
    private String cnpj;

    @Column(length = 200) // [cite: 2963]
    private String endereco;

    @Column(length = 20) 
    private String telefone; 

    @OneToMany(mappedBy = "empresaApoiadora") 
    private List<CadastroCampanhas> campanhas;
}