package br.com.ecologica.visualizacao;

import br.com.ecologica.cadastro.CadastroEmpresasRecicladoras;
import br.com.ecologica.cadastro.usuarios.model.Usuario;
import br.com.ecologica.visualizacao.model.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "solicitacao") 
public class VisualizacaoSolicitacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao") 
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario") 
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_recicladora") 
    private CadastroEmpresasRecicladoras empresaRecicladora;

    @Lob
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status") 
    private StatusSolicitacao status;

    @Column(name = "data_solicitacao", updatable = false, insertable = false) 
    private LocalDateTime dataSolicitacao;

}