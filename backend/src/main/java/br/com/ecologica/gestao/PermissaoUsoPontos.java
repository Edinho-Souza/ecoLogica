package br.com.ecologica.gestao;

import br.com.ecologica.cadastro.usuarios.model.Usuario; 
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "permissao_uso_pontos")
public class PermissaoUsoPontos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false)
    private boolean permitido;

    private String motivo;

}