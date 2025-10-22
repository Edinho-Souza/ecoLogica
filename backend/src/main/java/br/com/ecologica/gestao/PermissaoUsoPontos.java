package br.com.ecologica.gestao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "permissao_uso_pontos")
public class PermissaoUsoPontos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioId;
    private boolean permitido;
    private String motivo;

    public boolean verificarPermissao() {
        // lógica para verificar se o usuário pode usar os pontos
        return permitido;
    }
}