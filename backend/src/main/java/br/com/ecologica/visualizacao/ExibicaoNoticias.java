package br.com.ecologica.visualizacao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "exibicao_noticias")
public class ExibicaoNoticias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String conteudo;
    private String fonte;
    private boolean publicado;

    public void exibir() {
        // lógica para exibir notícia ao usuário
    }
}