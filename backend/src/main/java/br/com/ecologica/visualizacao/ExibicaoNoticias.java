package br.com.ecologica.visualizacao;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "noticia")
public class ExibicaoNoticias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_noticia") 
    private Long id;

    @Column(length = 150)
    private String titulo;

    @Lob 
    private String conteudo;

    @Column(name = "data_publicacao") 
    private LocalDate dataPublicacao;

    @Column(length = 100) 
    private String autor; 

}