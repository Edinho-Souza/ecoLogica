package br.com.ecologica.service;

import br.com.ecologica.dto.ResetPasswordRequest;
import br.com.ecologica.model.PasswordResetToken;
import br.com.ecologica.model.Usuario;
import br.com.ecologica.repository.PasswordResetTokenRepository;
import br.com.ecologica.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RecuperacaoSenhaService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final int EXPIRATION_HOURS = 1;

    @Transactional
    public String solicitarReset(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não cadastrado."));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(EXPIRATION_HOURS);

        PasswordResetToken resetToken = new PasswordResetToken(token, usuario, expiryDate);
        tokenRepository.save(resetToken);
        
        return token;
    }

    @Transactional
    public void resetarSenha(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token expirado.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);

        tokenRepository.delete(resetToken);
    }
}