package br.com.ecologica.gestao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "gestao_conteudo")
public class GestaoConteudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipoConteudo;
    private String titulo;
    private String descricao;
    private boolean publicado;

    public void gerenciar() {
        // lógica para gerenciar conteúdo (publicar, editar, remover)
    }
}