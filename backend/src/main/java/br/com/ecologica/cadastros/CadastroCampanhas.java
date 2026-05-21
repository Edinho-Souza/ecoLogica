package br.com.ecologica.cadastros;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "campanha")
public class CadastroCampanhas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campanha")
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo; // Nome da Campanha

    @Lob
    private String descricao;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "imagem_url", length = 500)
    private String imagemUrl;

    @Column(name = "pontos_extras")
    private Integer pontosExtras;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_apoiadora")
    private CadastroEmpresasApoiadoras empresaApoiadora;

    /**
     * Verifica se a campanha está ativa na data atual.
     * Requer que a data de início e a data de fim estejam preenchidas.
     */
    public boolean isAtiva() {
        LocalDate hoje = LocalDate.now();

        if (this.dataInicio == null || this.dataFim == null) {
            return false;
        }

        // isAfter/isBefore são exclusivos. Para inclusivo, usamos isEqual/isAfter e isEqual/isBefore.
        boolean aposInicio = hoje.isEqual(this.dataInicio) || hoje.isAfter(this.dataInicio);
        boolean antesFim = hoje.isEqual(this.dataFim) || hoje.isBefore(this.dataFim);

        return aposInicio && antesFim;
    }

    // O método getNomeCampanha() foi removido pois @Data já gera getTitulo(), que é a mesma informação.
}
