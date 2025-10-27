package br.com.ecologica.busca;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "busca_locais_coleta")
public class BuscaLocaisColeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cidade;
    private String tipoMaterial;

    public void buscar() {
        // lógica de busca por locais de coleta
    }
}