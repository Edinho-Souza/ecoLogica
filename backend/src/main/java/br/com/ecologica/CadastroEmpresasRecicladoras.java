package br.com.ecologica;

import br.com.ecologica.model.Usuario;
import jakarta.persistence.*;
import lombok.Getter; // Usar anotações específicas em vez de @Data
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "empresarecicladora")
@Getter 
@Setter
@NoArgsConstructor // Construtor JPA
@ToString(exclude = "usuario") // Exclui a relação para evitar problemas
@EqualsAndHashCode(exclude = "usuario") // Exclui a relação para evitar problemas
public class CadastroEmpresasRecicladoras {

    // O ID é mapeado pelo ID do Usuario (chave compartilhada)
    @Id
    @Column(name = "id_recicladora") 
    private Long id; // Este ID terá o mesmo valor do Usuario

    // Relacionamento 1:1 com chave primária compartilhada
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Mapeia o ID da coluna atual (id_recicladora) para o ID da entidade relacionada (Usuario)
    @JoinColumn(name = "id_recicladora")
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(length = 200) 
    private String endereco;

    @Column(length = 20) 
    private String telefone;

    /**
     * Implementação sugerida para obter o nome, assumindo que ele está na entidade Usuario.
     */
    public String getNomeEmpresa() {
        if (this.usuario != null) {
            // Supondo que a entidade Usuario tem um método getNome()
            return this.usuario.getNome(); 
        }
        return "Nome Indisponível";
    }
}