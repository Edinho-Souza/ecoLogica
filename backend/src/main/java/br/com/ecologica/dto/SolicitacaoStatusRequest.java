package br.com.ecologica.dto;

import br.com.ecologica.model.StatusSolicitacao;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SolicitacaoStatusRequest {
    @NotNull(message = "O status da solicitacao e obrigatorio")
    private StatusSolicitacao status;
}
