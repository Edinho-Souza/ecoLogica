package br.com.ecologica.login;

import br.com.ecologica.login.dto.ForgotPasswordRequest;
import br.com.ecologica.login.dto.ResetPasswordRequest;
import br.com.ecologica.login.service.RecuperacaoSenhaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recuperar-senha")
public class RecuperacaoSenhaController {

    @Autowired
    private RecuperacaoSenhaService service;

    @PostMapping("/solicitar")
    public ResponseEntity<String> solicitarRecuperacao(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String token = service.solicitarReset(request.getEmail());
            return ResponseEntity.ok("Solicitação recebida. Em produção, um e-mail seria enviado. Token (simulado): " + token);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resetar")
    public ResponseEntity<String> resetarSenha(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            service.resetarSenha(request);
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}