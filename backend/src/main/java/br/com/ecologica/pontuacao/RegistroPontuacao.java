package br.com.ecologica.pontuacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "registro_pontuacao")
public class RegistroPontuacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;
    private int pontos;
    private String atividade;
    private LocalDateTime dataRegistro;

    public void registrar() {
        this.dataRegistro = LocalDateTime.now();
        // lógica para registrar pontuação
    }
}