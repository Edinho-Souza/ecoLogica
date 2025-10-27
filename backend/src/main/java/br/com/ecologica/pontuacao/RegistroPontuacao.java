package br.com.ecologica.pontuacao;

import br.com.ecologica.cadastro.CadastroUsuarios;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "registro_pontuacao")
public class RegistroPontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int pontos;
    private String atividade;
    private LocalDateTime dataRegistro;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private CadastroUsuarios usuario;

    public void registrar() {
        this.dataRegistro = LocalDateTime.now();
        // lógica para registrar pontuação
    }
}