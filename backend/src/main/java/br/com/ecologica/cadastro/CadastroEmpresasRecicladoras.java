package br.com.ecologica.cadastro;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "empresarecicladora")
public class CadastroEmpresasRecicladoras {

    @Id
    @Column(name = "id_recicladora") 
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId 
    @JoinColumn(name = "id_recicladora")
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(length = 200) 
    private String endereco;

    @Column(length = 20) 
    private String telefone;

}