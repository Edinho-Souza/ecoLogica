package br.com.ecologica.visualizacao;

import br.com.ecologica.cadastro.usuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "historico")
public class HistoricoPontuacao { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico") 
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario") 
    private Usuario usuario;

    @Column(length = 200) 
    private String acao;

    @Column(name = "data", updatable = false, insertable = false) 
    private LocalDateTime data;

}