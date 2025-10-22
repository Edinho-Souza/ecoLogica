package br.com.ecologica.cadastro;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "cadastro_empresas_apoiadoras")
public class CadastroEmpresasApoiadoras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeEmpresa;
    private String cnpj;
    private String contato;
    private boolean ativa;

    public void registrarEmpresa() {
        // lógica para registrar empresa apoiadora
    }
}